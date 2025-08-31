import { ApolloServer } from '@apollo/server';
import { createLoaders } from '@appvantageasia/core-dataloaders';
import { makeExecutableSchema } from '@graphql-tools/schema';
import type { DocumentNode } from 'graphql/index.js';
import createLazyUserAbility from '../src/abilities/createLazyUserAbility.js';
import type { Context } from '../src/apolloServer/mapped-types.js';
import type { GqlResolvers } from '../src/apolloServer/resolver-types.js';

const createApolloServer = async (resolvers: GqlResolvers) => {
    // asynchronously load types definition and implementations
    const { default: typeDefs } = await import('../src/apolloServer/schema-ast.graphql');

    // turn the schema into an executable
    const schema = makeExecutableSchema({ typeDefs: [typeDefs], resolvers });

    // instance the apollo server
    const server = new ApolloServer<Context>({ schema });

    const executeOperation = async (
        query: string | DocumentNode,
        variables: Record<string, any>,
        context?: Partial<Context>
    ) => {
        const dataLoader = createLoaders();
        const contextValue: Context = {
            user: null,
            session: null,
            getAbilities: createLazyUserAbility(context?.user),
            userAgent: '',
            dataLoader: dataLoader,
            hostname: 'localhost',
            ip: '127.0.0.1',
            ...context,
        };

        return server.executeOperation({ query, variables }, { contextValue });
    };

    return { server, executeOperation };
};

export default createApolloServer;
