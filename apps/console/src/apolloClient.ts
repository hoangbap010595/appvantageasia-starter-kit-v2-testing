import { split, ApolloClient, InMemoryCache, from, ApolloLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { createClient } from 'graphql-ws';
import introspection from './apolloClient.introspection';
import runtime from './runtime';
import prepareDataForGraphQL from './utils/prepareDataForGraphQL';
import { getToken, onTokenUpdate, triggerUnauthenticatedError } from './utils/session';

// extract the host and protocol from the window location
const { host, protocol } = window.location;

// create the HTTP link for standard GraphQL queries/mutations
const httpLink = createUploadLink({ uri: `${protocol}//${host}/api/graphql`, credentials: 'include' });

// create a WebSocket link for Subscriptions
const wsProtocol = protocol === 'https:' ? 'wss' : 'ws';

const wsClient = createClient({
    url: `${wsProtocol}://${host}/api/subscriptions`,
    lazy: true,
});

const wsLink = new GraphQLWsLink(wsClient);

// link to add the JWT token in authorization header
const addAuthorizationHeaderLink = new ApolloLink((operation, forward) => {
    // @ts-expect-error TS7031: Binding element headers implicitly has an any type.
    operation.setContext(({ headers }) => {
        const token = getToken();

        if (!token) {
            return { headers };
        }

        return {
            headers: {
                ...headers,
                Authorization: `Bearer ${token}`,
                'Apollo-Require-Preflight': 'true',
            },
        };
    });

    return forward(operation);
});

// create a split link to either use HTTTP or WS links based on the definition
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);

        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    from([addAuthorizationHeaderLink, httpLink])
);

// link to prepare GraphQL variables for submissions
const prepareDataLink = new ApolloLink((operation, forward) => {
    operation.variables = prepareDataForGraphQL(operation.variables);

    return forward(operation);
});

// handle unauthenticated errors
const handleUnauthenticatedErrorLink = onError(({ graphQLErrors }) => {
    if (graphQLErrors) {
        const isUnauthenticated = graphQLErrors.some(error => error.extensions?.code === 'UNAUTHENTICATED');

        if (isUnauthenticated) {
            triggerUnauthenticatedError();
        }
    }
});

const cache = new InMemoryCache({ possibleTypes: introspection.possibleTypes });

// initialize the apollo client
const client = new ApolloClient({
    link: from([prepareDataLink, handleUnauthenticatedErrorLink, splitLink]),
    cache,
    devtools: runtime.apolloDevToolsEnabled
        ? {
              enabled: true,
              name: host,
          }
        : undefined,
});

onTokenUpdate(token => {
    if (!token) {
        // once the client is signed out make sure we dropped everything
        // ensure nothing sensitive may remain in the cache
        return client.clearStore();
    }
});

export default client;
