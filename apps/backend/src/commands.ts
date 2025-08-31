import { mkdtemp, open } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { URL } from 'node:url';
import { print } from '@appvantageasia/core-node-utils';
import initializeSentry from './initializeSentry.js';

const createCleanUpOnExit = (cleanUpFunction: () => Promise<any>) => {
    let promise: Promise<any> | null = null;

    const onExit = (signal: string) => () => {
        print.warn(`Received ${signal}, cleaning up...`);

        if (promise) {
            print.warn('Already cleaning up...');
        } else {
            promise = cleanUpFunction().then(() => process.exit(0));
        }
    };

    process.on('SIGTERM', onExit('SIGTERM'));
    process.on('SIGINT', onExit('SIGINT'));
};

export const startWorker = async () => {
    // initialize sentry
    initializeSentry();

    // start worker
    const { setupProcess, setupPeriods, stopQueue } = await import('./bullJobs/index.js');
    await setupPeriods();
    setupProcess();

    // then start health probes
    const { startHealthMonitor, registerMonitor } = await import('./healthMonitor/index.js');
    const { default: databaseMonitor } = await import('./healthMonitor/monitors/DatabaseMonitor.js');
    const { default: bullMonitor } = await import('./healthMonitor/monitors/BullMonitor.js');
    const { default: redisMonitor } = await import('./healthMonitor/monitors/RedisMonitor.js');
    const { default: pubSubMonitor } = await import('./healthMonitor/monitors/PubSubMonitor.js');
    registerMonitor(redisMonitor, databaseMonitor, bullMonitor, pubSubMonitor);
    const stopHealthMonitor = await startHealthMonitor();

    // start prometheus export
    const { default: startPrometheusExport } = await import('./prometheus/start.js');
    const stopPrometheusExport = await startPrometheusExport();

    // configure cleanup
    createCleanUpOnExit(() => Promise.all([stopQueue(), stopPrometheusExport()]).then(stopHealthMonitor));
};

export const startApi = async () => {
    // initialize sentry
    initializeSentry({ withExpressServer: true });

    // start express/apollo servers
    const { startListening, stopListening } = await import('./expressServer/index.js');
    await startListening();

    // start health probes
    const { startHealthMonitor, registerMonitor } = await import('./healthMonitor/index.js');
    const { default: databaseMonitor } = await import('./healthMonitor/monitors/DatabaseMonitor.js');
    const { default: bullMonitor } = await import('./healthMonitor/monitors/BullMonitor.js');
    const { default: redisMonitor } = await import('./healthMonitor/monitors/RedisMonitor.js');
    const { default: expressServerMonitor } = await import('./healthMonitor/monitors/ExpressServerMonitor.js');
    const { default: pubSubMonitor } = await import('./healthMonitor/monitors/PubSubMonitor.js');
    registerMonitor(redisMonitor, databaseMonitor, bullMonitor, expressServerMonitor, pubSubMonitor);
    const stopHealthMonitor = await startHealthMonitor();

    // start prometheus export
    const { default: startPrometheusExport } = await import('./prometheus/start.js');
    const stopPrometheusExport = await startPrometheusExport();

    // configure cleanup
    createCleanUpOnExit(() => Promise.all([stopListening(), stopPrometheusExport()]).then(stopHealthMonitor));
};

export const startBroker = async () => {
    // initialize Sentry
    initializeSentry();

    // start brokers
    const { default: broker, createServices } = await import('./broker.js');
    await createServices();
    await broker.start();

    // then health probes
    const { startHealthMonitor, registerMonitor } = await import('./healthMonitor/index.js');
    const { default: databaseMonitor } = await import('./healthMonitor/monitors/DatabaseMonitor.js');
    const { default: bullMonitor } = await import('./healthMonitor/monitors/BullMonitor.js');
    const { default: brokerMonitor } = await import('./healthMonitor/monitors/BrokerMonitor.js');
    const { default: redisMonitor } = await import('./healthMonitor/monitors/RedisMonitor.js');
    const { default: pubSubMonitor } = await import('./healthMonitor/monitors/PubSubMonitor.js');
    registerMonitor(redisMonitor, databaseMonitor, bullMonitor, brokerMonitor, pubSubMonitor);
    const stopHealthMonitor = await startHealthMonitor();

    // start prometheus export
    const { default: startPrometheusExport } = await import('./prometheus/start.js');
    const stopPrometheusExport = await startPrometheusExport();

    // then cleanups
    createCleanUpOnExit(() => Promise.all([broker.stop(), stopPrometheusExport()]).then(stopHealthMonitor));
};

export const runMigrations = async () => {
    const { default: migrations } = await import('./migrations.js');
    const { migrate } = await import('@appvantageasia/core-database');
    await migrate(migrations);
    process.exit(0);
};

export const startAll = async () => {
    // initialize sentry
    initializeSentry({ withExpressServer: true });

    // get workers
    const { setupProcess, setupPeriods, stopQueue } = await import('./bullJobs/index.js');
    // get express/apollo servers
    const { startListening, stopListening } = await import('./expressServer/index.js');
    // get brokers
    const { default: broker, createServices } = await import('./broker.js');

    // setup periodic bull jobs
    await setupPeriods();

    // start the workers
    setupProcess();

    // start brokers
    await createServices();
    await broker.start();

    // start the web server
    await startListening();

    // then start health probes
    const { startHealthMonitor, registerMonitor } = await import('./healthMonitor/index.js');
    const { default: databaseMonitor } = await import('./healthMonitor/monitors/DatabaseMonitor.js');
    const { default: bullMonitor } = await import('./healthMonitor/monitors/BullMonitor.js');
    const { default: brokerMonitor } = await import('./healthMonitor/monitors/BrokerMonitor.js');
    const { default: redisMonitor } = await import('./healthMonitor/monitors/RedisMonitor.js');
    const { default: expressServerMonitor } = await import('./healthMonitor/monitors/ExpressServerMonitor.js');
    const { default: pubSubMonitor } = await import('./healthMonitor/monitors/PubSubMonitor.js');
    registerMonitor(redisMonitor, databaseMonitor, bullMonitor, brokerMonitor, expressServerMonitor, pubSubMonitor);
    const stopHealthMonitor = await startHealthMonitor();

    // start prometheus export
    const { default: startPrometheusExport } = await import('./prometheus/start.js');
    const stopPrometheusExport = await startPrometheusExport();

    // configure cleanup
    createCleanUpOnExit(() =>
        Promise.all([stopQueue(), broker.stop(), stopListening(), stopPrometheusExport()]).then(stopHealthMonitor)
    );
};

export const createUser = async () => {
    const { default: createUserCommand } = await import('./utils/createUserCommand.js');
    await createUserCommand();
    process.exit(0);
};

export const dumpDatabase = async (bucket?: string) => {
    const outputDirectory = await mkdtemp(join(tmpdir(), 'snapshot-'));
    const { execute } = await import('@appvantageasia/core-node-utils');
    const { config } = await import('@appvantageasia/core-database');

    // build proper database URI which support AWS authentication
    const databaseUri = new URL(config.databaseUri);

    if (config.authMechanism === 'MONGODB-AWS') {
        databaseUri.searchParams.append('authMechanism', config.authMechanism);
        databaseUri.searchParams.append('authSource', '$external');
    }

    // dump the database with mongodump
    const dumpDirectory = join(outputDirectory, 'dump');
    await execute('mongodump', ['--gzip', `--out=${dumpDirectory}`, databaseUri.toString()], {
        detached: true,
        env: process.env,
        verbose: true,
    });

    // then archive the database with tar
    const archiveName = `snapshot-${new Date().getTime()}.tar.gz`;
    await execute('tar', ['-czf', archiveName, '-C', dumpDirectory, '.'], {
        cwd: outputDirectory,
        detached: true,
        verbose: true,
    });

    const { uploadFile } = await import('@appvantageasia/core-storage');
    const file = await open(join(outputDirectory, archiveName), 'r');
    const stream = file.createReadStream();
    await uploadFile(stream, 'snapshots/', archiveName, 'application/gzip', 'binary', bucket || undefined);

    process.exit(0);
};
