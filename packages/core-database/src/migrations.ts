import { print } from '@appvantageasia/core-node-utils';
import { ObjectId } from 'mongodb';
import type { DatabaseClient } from './getDatabaseClient.js';
import getDatabaseClient from './getDatabaseClient.js';

export interface Migration {
    // unique identifier for the migration
    identifier: string;

    // up method is executed when running the migration
    up: (databaseClient: DatabaseClient) => Promise<void>;

    // list squahed migration matching this migration document
    // it may be a list of identifier or a list of migration document
    squash?: (Migration | string)[];
}

// document persisted in databases to track migrations
export interface MigrationDocument {
    _id: ObjectId;
    identifier: string;
    executedAt: Date;
}

export const migrate = async (migrations: Migration[], verbose = true): Promise<void> => {
    const databaseClient = await getDatabaseClient();
    const migrationCollection = databaseClient.db.collection<MigrationDocument>('_core.migrations');

    // fetch existing migrations
    const executed = await migrationCollection
        .find({})
        .map(migration => migration.identifier)
        .toArray();

    // loop on migration
    const chainMigrations = (targetedMigrations: Migration[]) =>
        targetedMigrations.reduce((promise, migration) => promise.then(executeMigration(migration)), Promise.resolve());

    // execute a single migration
    const executeMigration = (migration: Migration) => async (): Promise<void> => {
        if (executed.includes(migration.identifier)) {
            // skip it, the migration is already applied
            return;
        }

        // keep track if we do need to run the migration
        let runMigration = true;

        if (migration.squash?.length) {
            // we need to check if a squash has been previously run
            // if so, we need to apply squashes instead
            const ranSquashedMigration = migration.squash.reduce((acc, squashedMigration) => {
                const identifier =
                    typeof squashedMigration === 'string' ? squashedMigration : squashedMigration.identifier;

                if (executed.includes(identifier)) {
                    return acc + 1;
                }

                return acc;
            }, 0);

            // we must run squashed migrations if there's at least one previously ran
            if (ranSquashedMigration > 0) {
                // if the counter is not the same, then there's some missing migrations
                if (ranSquashedMigration !== migration.squash.length) {
                    const missingMigration = migration.squash.find(
                        squashedMigration => typeof squashedMigration === 'string'
                    );

                    if (missingMigration) {
                        // print the error
                        print.error(
                            `Failed to execute ${migration.identifier} as the ` +
                                `squashed migration ${missingMigration} is missing`,
                            'DATABASE'
                        );

                        // stop here
                        throw new Error('Migration failure');
                    }

                    // we need to apply those instead then
                    // forcefully cast into migration array as we previously excluded strings
                    await chainMigrations(migration.squash as Migration[]);
                }

                // do not run the migration itself
                runMigration = false;
            }
        }

        if (runMigration) {
            try {
                // run the migration
                await migration.up(databaseClient);
            } catch (error) {
                // print the error
                print.error(`Failed to execute ${migration.identifier}`, 'DATABASE');
                // throw it back
                throw error;
            }
        }

        // persist the run
        await migrationCollection.insertOne({
            _id: new ObjectId(),
            identifier: migration.identifier,
            executedAt: new Date(),
        });

        // add it to executed migration
        // this is only to cover situations in which a migration is included multiple times
        executed.push(migration.identifier);

        if (verbose) {
            print.info(`${migration.identifier} executed`, 'DATABASE');
        }
    };

    return chainMigrations(migrations);
};

export const listPendingMigrations = async (migrations: Migration[]): Promise<string[]> => {
    const databaseClient = await getDatabaseClient();
    const migrationCollection = databaseClient.db.collection<MigrationDocument>('_core.migrations');

    // fetch existing migrations
    const executed = await migrationCollection
        .find({})
        .map(migration => migration.identifier)
        .toArray();

    return migrations
        .filter(migration => !executed.includes(migration.identifier))
        .map(migration => migration.identifier);
};
