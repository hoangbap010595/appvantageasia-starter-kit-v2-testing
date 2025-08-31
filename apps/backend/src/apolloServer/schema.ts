/// <reference path="../types/graphql.d.ts" />
import { makeExecutableSchema } from '@graphql-tools/schema';

// asynchronously load types definition and implementations
const { default: typeDefs } = await import('./schema-ast.graphql');

// import the resolvers
const { default: resolvers } = await import('./resolvers.js');

// turn the schema into an executable
const schema = makeExecutableSchema({ typeDefs: [typeDefs], resolvers });

export default schema;
