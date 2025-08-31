import { print } from '@appvantageasia/core-node-utils';
import grpc from '@grpc/grpc-js';
import type { ServingStatus } from 'grpc-health-check';
import * as config from '../config.js';
import { getMonitors } from './registry.js';

export { registerMonitor, getMonitors } from './registry.js';

const { healthMonitorHost: host, healthMonitorPort: port } = config;

export const startHealthMonitor = async (): Promise<() => Promise<void>> => {
    const { default: server, healthService } = await import('./server.js');

    if (!config.healthMonitorEnabled) {
        return () => Promise.resolve<undefined>(undefined);
    }

    let isRunning = true;
    let currentPromise: Promise<void> | null = null;

    // first set all serviced as unknown
    getMonitors().forEach(monitor => {
        healthService.setStatus(monitor.name, 'UNKNOWN');
    });

    // overall status as unknown as well
    healthService.setStatus('', 'UNKNOWN');

    const updateStatus = async () => {
        if (!isRunning) {
            currentPromise = null;

            // do not perform health checks on monitors
            return;
        }

        // run on monitors
        const results = await Promise.all(
            getMonitors().map(async (monitor): Promise<ServingStatus> => {
                try {
                    const checkResult = await monitor.run();
                    healthService.setStatus(monitor.name, checkResult.state);

                    checkResult.messages?.forEach(message => {
                        print.warn(`${message} (${monitor.name})`, 'HEALTH');
                    });

                    if (config.healthMonitorVerbose > 1) {
                        print.info(`Health status for ${monitor.name} set to ${checkResult.state}`, 'HEALTH');
                    }

                    return checkResult.state;
                } catch (error) {
                    console.error(error);
                    print.error(`fail to run monitor on ${monitor.name}`, 'HEALTH');
                    healthService.setStatus(monitor.name, 'UNKNOWN');

                    return 'UNKNOWN';
                }
            })
        );

        // finally update the overall service
        let overallStatus: ServingStatus = 'UNKNOWN';
        if (results.includes('UNKNOWN')) {
            overallStatus = 'UNKNOWN';
        } else if (results.includes('NOT_SERVING')) {
            overallStatus = 'NOT_SERVING';
        } else {
            overallStatus = 'SERVING';
        }

        if (config.healthMonitorVerbose > 0) {
            print.info(`Overall health status set to ${overallStatus}`, 'HEALTH');
        }

        healthService.setStatus('', overallStatus);

        if (isRunning) {
            currentPromise = new Promise<void>(resolve => {
                setTimeout(resolve, config.healthMonitorInterval);
            }).then(updateStatus);
        } else {
            currentPromise = null;
        }
    };

    // start the check loop
    currentPromise = updateStatus();

    // start the web server on the given port
    await new Promise<void>(resolve => {
        const address = `${host}:${port}`;
        print.info(`Binging gRPC server on ${address}...`, 'HEALTH');
        server.bindAsync(address, grpc.ServerCredentials.createInsecure(), () => {
            print.info('gRPC server started', 'HEALTH');
            resolve();
        });
    });

    return () =>
        new Promise<void>(resolve => {
            // set running to false
            isRunning = false;

            // forcefully shutdown
            server.forceShutdown();

            // wait for the last check to complete
            if (currentPromise) {
                currentPromise.then(resolve);
            } else {
                resolve();
            }
        }).then(() => {
            print.info('gRPC server has shutdown', 'HEALTH');
        });
};
