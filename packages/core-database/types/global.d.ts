/* eslint-disable no-var */
import type { DatabaseClient } from '../src/getDatabaseClient.js';

declare global {
    namespace globalThis {
        var mongo:
            | {
                  value: DatabaseClient | null;
                  promise: Promise<DatabaseClient> | null;
              }
            | undefined;
    }
}
