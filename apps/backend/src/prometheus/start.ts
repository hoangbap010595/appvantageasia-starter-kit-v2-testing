import type * as http from 'http';
import type { AddressInfo } from 'node:net';
import { print } from '@appvantageasia/core-node-utils';
import compression from 'compression';
import express from 'express';
import * as config from '../config.js';

const start = async (): Promise<() => Promise<void>> => {
    if (!config.usePrometheusExport) {
        return () => Promise.resolve<undefined>(undefined);
    }

    const expressServer = express();

    // disable informational headers
    expressServer.disable('x-powered-by');

    // enable compression
    expressServer.use(compression());

    const { default: register } = await import('./register.js');

    expressServer.get('/metrics', (req, res, next) => {
        res.set('Content-Type', register.contentType);
        register
            .metrics()
            .then(metrics => res.end(metrics))
            .catch(next);
    });

    const httpServer = await new Promise<http.Server>((resolve, reject) => {
        try {
            print.info('Starting web server...', 'PROMETHEUS');
            const server = expressServer.listen(config.prometheusExportPort, config.prometheusExportHost, () => {
                const { address, port } = server.address() as AddressInfo;
                print.info(`Web server listening on http://${address}:${port}`, 'PROMETHEUS');
                resolve(server);
            });
        } catch (error) {
            reject(error);
        }
    });

    return () =>
        new Promise(resolve => {
            setTimeout(() => {
                httpServer.close(resolve);
            }, 1000);
        }).then(() => {
            print.info(`Web server stopped listening`, 'PROMETHEUS');
        });
};

export default start;
