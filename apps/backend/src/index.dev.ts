import './initializeSentry.dev.js';
import { print } from '@appvantageasia/core-node-utils';
import { getCollections } from '@appvantageasia/core-users';
import * as config from './config.js';

/* Step 1 - Execute migrations */

const { default: migrations } = await import('./migrations.js');
const { listPendingMigrations, migrate } = await import('@appvantageasia/core-database');
const pendingMigrationsCount = await listPendingMigrations(migrations).then(results => results.length);

if (pendingMigrationsCount > 0) {
    const { default: prompts } = await import('prompts');
    const { shouldRunMigrations } = await prompts({
        type: 'confirm',
        name: 'shouldRunMigrations',
        message: `There are ${pendingMigrationsCount} pending migrations. Would you like to run them now?`,
        initial: true,
    });

    if (shouldRunMigrations) {
        await migrate(migrations);
    }
}

/* Step 2 - Create first user */

const { users } = await getCollections();
const userCount = await users.countDocuments();

if (userCount === 0) {
    const { default: prompts } = await import('prompts');
    const { shouldCreateUser } = await prompts({
        type: 'confirm',
        name: 'shouldCreateUser',
        message: 'No users found. Would you like to create one now?',
        initial: true,
    });

    if (shouldCreateUser) {
        const { default: createUserCommand } = await import('./utils/createUserCommand.js');

        try {
            await createUserCommand(() => {
                throw new Error('SKIP');
            });
        } catch (error) {
            if (error instanceof Error && error.message !== 'SKIP') {
                console.error(error);
                process.exit(1);
            } else {
                print.info('User creation skipped');
            }
        }
    }
}

/* Step 3 - Start all services */

const { default: broker, createServices } = await import('./broker.js');
const { setupPeriods, setupProcess } = await import('./bullJobs/index.js');
const { startListening } = await import('./expressServer/index.js');

// create services for brokers/moleculer
await createServices();

// initialize the broker first
// this one is pretty verbose
await broker.start();

// start the web server for API serving
await startListening();

// setup periodic bull jobs
await setupPeriods();

// then start processes for bull jobs
await setupProcess();

if (config.healthMonitorEnabled) {
    const { startHealthMonitor, registerMonitor } = await import('./healthMonitor/index.js');
    const { default: redisMonitor } = await import('./healthMonitor/monitors/RedisMonitor.js');
    const { default: brokerMonitor } = await import('./healthMonitor/monitors/BrokerMonitor.js');
    const { default: databaseMonitor } = await import('./healthMonitor/monitors/DatabaseMonitor.js');
    const { default: bullMonitor } = await import('./healthMonitor/monitors/BullMonitor.js');
    const { default: expressServerMonitor } = await import('./healthMonitor/monitors/ExpressServerMonitor.js');
    const { default: pubSubMonitor } = await import('./healthMonitor/monitors/PubSubMonitor.js');
    registerMonitor(redisMonitor, brokerMonitor, databaseMonitor, bullMonitor, expressServerMonitor, pubSubMonitor);
    await startHealthMonitor();
}

if (config.usePrometheusExport) {
    const { default: startPrometheusExport } = await import('./prometheus/start.js');
    await startPrometheusExport();
}

// reset cache on users' abilities
const { revokeAllCache } = await import('./abilities/cache.js');
await revokeAllCache();
