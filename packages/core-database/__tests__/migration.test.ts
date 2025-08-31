import { describe, expect, test, vi, beforeEach, afterAll } from 'vitest';
import getDatabaseClient, { closeConnections } from '../src/getDatabaseClient.js';
import type { Migration } from '../src/migrations.js';
import { migrate, listPendingMigrations } from '../src/migrations.js';

beforeEach(async () => {
    const { db } = await getDatabaseClient();
    await db.dropDatabase();
});

afterAll(() => closeConnections(true));

describe('migrate', () => {
    test('should run migrations in order', async () => {
        const migrationUp1 = vi.fn(() => Promise.resolve(undefined));
        const migrationUp2 = vi.fn(() => Promise.resolve(undefined));
        const migrations = [
            { identifier: 'migration1', up: migrationUp1 },
            { identifier: 'migration2', up: migrationUp2 },
        ];

        await migrate(migrations, false);

        expect(migrationUp1).toHaveBeenCalledBefore(migrations[1].up);
    });

    test('should skip already executed migrations', async () => {
        const migrationUp1 = vi.fn(() => Promise.resolve(undefined));
        const migration1: Migration = { identifier: 'migration1', up: migrationUp1 };

        const migration2: Migration = {
            identifier: 'migration2',
            up: vi.fn(() => Promise.resolve(undefined)),
        };

        await migrate([migration1], false);

        migrationUp1.mockReset();

        await migrate([migration1, migration2], false);

        expect(migration1.up).not.toHaveBeenCalled();
        expect(migration2.up).toHaveBeenCalledTimes(1);
    });
});

describe('listPendingMigrations', () => {
    test('should return unexecuted migrations', async () => {
        const migrations: Migration[] = [
            { identifier: 'migration1', up: () => Promise.resolve(undefined) },
            { identifier: 'migration2', up: () => Promise.resolve(undefined) },
        ];

        await migrate([migrations[0]], false);

        const pending = await listPendingMigrations(migrations);

        expect(pending).toEqual(['migration2']);
    });
});
