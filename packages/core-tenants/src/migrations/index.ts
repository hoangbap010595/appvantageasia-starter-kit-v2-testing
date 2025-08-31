import type { Migration } from '@appvantageasia/core-database';
import createInitialIndexes from './01_createInitialIndexes.js';

const migrations: Migration[] = [createInitialIndexes];

export default migrations;
