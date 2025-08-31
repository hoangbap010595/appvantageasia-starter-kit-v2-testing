import type { CodegenConfig } from '@graphql-codegen/cli';
import type { SchemaASTConfig } from '@graphql-codegen/schema-ast';
import type { TypeScriptPluginConfig } from '@graphql-codegen/typescript';
import type { TypeScriptResolversPluginConfig } from '@graphql-codegen/typescript-resolvers';

const resolverPluginConfig: TypeScriptPluginConfig & TypeScriptResolversPluginConfig = {
    typesPrefix: 'Gql',
    enumValues: './enums.js',
    contextType: './mapped-types.js#Context',
    fieldContextTypes: ['Subscription.eventFromConsoleSession#{}', 'Subscription.eventFromUserSession#{}'],
    mappers: {
        UploadedFile: './mapped-types.js#UploadedFileDocument',
        UserSession: './mapped-types.js#UserSession',
        User: './mapped-types.js#UserDocument',
        SSOConfiguration: './mapped-types.js#SSOConfiguration',
        MSALConfiguration: './mapped-types.js#MSALConfiguration',
        OIDCConfiguration: './mapped-types.js#OIDCConfiguration',
        TenantMembership: './mapped-types.js#ExtendedTenantMembership',
        Tenant: './mapped-types.js#TenantDocument',
    },
    scalars: {
        ObjectID: 'mongodb#ObjectId',
        Upload: './mapped-types.js#Upload',
    },
};

const astPluginConfig: SchemaASTConfig = {
    includeDirectives: true,
};

const config: CodegenConfig = {
    schema: './schema/**/*.graphql',
    generates: {
        './src/apolloServer/resolver-types.ts': {
            config: resolverPluginConfig,
            plugins: ['typescript', 'typescript-resolvers'],
        },

        './src/apolloServer/schema-ast.graphql': {
            plugins: ['schema-ast'],
            config: astPluginConfig,
        },
    },
};

export default config;
