import type { Migration } from '@appvantageasia/core-database';
import { migrations as tenantMigrations } from '@appvantageasia/core-tenants';
import { migrations as userMigrations } from '@appvantageasia/core-users';

const migrations: Migration[] = [...userMigrations, ...tenantMigrations];

export default migrations;
