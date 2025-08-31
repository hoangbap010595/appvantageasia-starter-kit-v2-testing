import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { IGraphQLConfig } from 'graphql-config';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: IGraphQLConfig = {
    schema: join(__dirname, './schema/**/*.graphql'),
    documents: [],
};

export default config;
