import { getDatabaseClient } from '@appvantageasia/core-database';
import { faker } from '@faker-js/faker';
import type { Snapshot } from './generators/types.js';

const sources: Record<string, () => Promise<Snapshot>> = {
    baseUsers: () => import('./targets/baseUsers.js'),
    baseTenants: () => import('./targets/baseTenants.js'),
};

const loadSnapshots = async (...targets: string[]) => {
    const { client } = await getDatabaseClient();

    // fix faker seed to ensure consistency for testing
    // https://github.com/faker-js/faker?tab=readme-ov-file#%EF%B8%8F-setting-a-randomness-seed
    faker.seed(4242);

    // drop main database and sub-databases from organizations
    await client
        .db()
        .admin()
        .listDatabases()
        .then(response => response.databases.filter(db => db.name.startsWith(process.env.APP_DB_NAME!)))
        .then(databases => Promise.all(databases.map(db => client.db(db.name).dropDatabase())));

    const trackers: Record<string, Promise<any>> = {};

    const loadTarget = (target: string, roots: string[] = []) => {
        // process the snapshots
        const promise = (async () => {
            const { execute, dependencies } = await sources[target]();

            if (dependencies?.length) {
                await Promise.all(
                    dependencies.map(dependency => {
                        if (roots.includes(dependency)) {
                            throw new Error(`Circular dependency detected: ${[...roots, dependency].join(' -> ')}`);
                        }

                        if (!trackers[dependency]) {
                            return loadTarget(dependency, [...roots, dependency]);
                        }

                        return trackers[dependency];
                    })
                );
            }

            await execute();
        })();

        // track the promise for this target
        trackers[target] = promise;

        return promise;
    };

    // load snapshots
    await Promise.all(targets.map(target => loadTarget(target)));

    // load helpers
    const { default: users } = await import('./helpers/users.js');

    return { users };
};

export default loadSnapshots;

export type SnapshotController = Awaited<ReturnType<typeof loadSnapshots>>;
