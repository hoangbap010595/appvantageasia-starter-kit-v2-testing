import { print } from '@appvantageasia/core-node-utils';
import * as Sentry from '@sentry/node';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import * as config from '../config.js';
import api from './api.js';
import applyCors from './handlers/applyCors.js';
import disableCache from './handlers/disableCache.js';
import errorHandler from './handlers/errorHandler.js';
import serveConsole from './handlers/serveConsole/index.js';
import { expressServer, httpServer } from './instance.js';

// wrap the express server with Sentry
Sentry.setupExpressErrorHandler(expressServer);

// disable informational headers
expressServer.disable('x-powered-by');

if (config.useCompression) {
    // enable compression
    // we might want to disable if it's delegated to a reverse proxy
    // such as nginx (most likely expected to be used as ingress controller in k8s environments)
    expressServer.use(compression());
}

// enable JSON and url encoded support
expressServer.use(express.json({ limit: config.jsonLimit }));
expressServer.use(express.urlencoded({ extended: true }));
expressServer.use(express.text());
expressServer.use(cookieParser());

// enable logs
expressServer.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

if (config.withCoverage) {
    const { default: serveCoverage } = await import('./handlers/serveCoverage.js');
    expressServer.get('/__coverage__', serveCoverage);
}

// apply CORS
expressServer.use(applyCors);

if (config.serveStatic) {
    // serve static assets
    expressServer.use('/public', express.static(config.staticDirectory));
    // avoid rendering HTML for public serving assets which does not exist
    expressServer.use('/public', (req, res) => {
        res.send(404);
    });
}

// disable cache
expressServer.use(disableCache);

if (config.usePrometheusExport) {
    const { default: usePrometheusBundle } = await import('./handlers/usePrometheusBundle.js');
    expressServer.use(usePrometheusBundle);
}

// serve API
expressServer.use('/api', api);

if (config.useBullBoard) {
    // bull board is only recommended for development purposes
    // we want to avoid loading the bull board in production
    const { default: serveBullBoard } = await import('./handlers/serveBullBoard.js');
    expressServer.use('/.bullBoard', serveBullBoard);
}

// serve console
expressServer.get('*', serveConsole);

// then here comes our error handler
expressServer.use(errorHandler);

export const startListening = () =>
    // start the web server on the given port
    new Promise<void>(resolve => {
        print.info('Starting web server...', 'API');

        httpServer.listen(config.port, config.host, () => {
            print.info(`Web server is now listening on http://${config.host}:${config.port}`, 'API');
            resolve();
        });
    });

export const stopListening = () =>
    new Promise(resolve => {
        process.nextTick(() => {
            print.info('Stopping web server...', 'API');
            httpServer.on('close', resolve);
            httpServer.close(resolve);
        });
    }).then(() => {
        print.info(`Web server stopped listening`, 'API');
    });

export { expressServer, httpServer } from './instance.js';
