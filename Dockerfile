FROM node:22.14.0-bookworm-slim as base

# install libmongocrypt
# this can be removed if the projects does not target a support for CSFLE
RUN apt-get update  \
    && apt-get install --no-install-recommends -y curl gnupg ca-certificates apt-transport-https dumb-init \
    && curl -L https://www.mongodb.org/static/pgp/libmongocrypt.asc | gpg --dearmor >/etc/apt/trusted.gpg.d/libmongocrypt.gpg \
    && echo "deb https://libmongocrypt.s3.amazonaws.com/apt/debian bookworm/libmongocrypt/1.9 main" | tee /etc/apt/sources.list.d/libmongocrypt.list \
    && curl -fsSL https://pgp.mongodb.com/server-7.0.asc | gpg --dearmor >/usr/share/keyrings/mongodb-server-7.0.gpg \
    && echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.com/apt/debian bookworm/mongodb-enterprise/7.0 main" | tee /etc/apt/sources.list.d/mongodb-enterprise.list \
    && apt-get update \
    && apt-get install -y libmongocrypt-dev mongodb-enterprise-cryptd \
    && curl -fsSL -o mongodb-database-tools.deb https://fastdl.mongodb.org/tools/db/mongodb-database-tools-debian12-x86_64-100.12.0.deb \
    && dpkg -i mongodb-database-tools.deb \
    && rm mongodb-database-tools.deb \
    && rm -rf /var/lib/apt/lists/*

# set production environment for node
ENV NODE_ENV=production

# create app directory
WORKDIR /usr/src/app

FROM base as dependencies

# install build dependencies
RUN apt-get update && apt-get install python3 make g++ -y

# copy everything we need from the builder to install dependencies
COPY --chown=node:node package.json yarn.lock .yarnrc.yml ./
COPY --chown=node:node .yarn ./.yarn

# install dependencies with frozen lockfile
RUN yarn install --immutable \
    && yarn cache clean

FROM base

# copy dependencies
COPY --from=dependencies /usr/src/app .

# preset directory for static files
ENV SERVER_STATIC_DIRECTORY=/usr/src/app/public

# copy everything
COPY --chown=node:node ./public ./public
COPY --chown=node:node ./chunks ./chunks
COPY --chown=node:node ./index.js ./index.js.map ./consoleManifest.json ./

# set the version
ARG VERSION
ENV APP_VERSION=${VERSION:-0.0.0-development}

# set the sentry release if any
ARG SENTRY_RELEASE
ENV APP_SENTRY_RELEASE=$SENTRY_RELEASE

# set user
USER node

# start command using the next entrypoint
CMD ["dumb-init", "node", "server.js"]
