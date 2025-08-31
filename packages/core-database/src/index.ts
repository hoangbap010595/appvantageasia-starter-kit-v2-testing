export * as config from './config.js';

export { default as getDatabaseClient, closeConnections } from './getDatabaseClient.js';

export type { DatabaseClient } from './getDatabaseClient.js';

export { default as createEncryptedCollection } from './createEncryptedCollection.js';

export { default as getKMS } from './getKMS.js';

export type { Migration, MigrationDocument } from './migrations.js';
export { migrate, listPendingMigrations } from './migrations.js';
