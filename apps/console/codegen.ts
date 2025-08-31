import type { CodegenConfig } from '@graphql-codegen/cli';
import type { FragmentMatcherConfig } from '@graphql-codegen/fragment-matcher';
import type { NearOperationFileConfig } from '@graphql-codegen/near-operation-file-preset';
import type { TypeScriptPluginConfig } from '@graphql-codegen/typescript';
import type { TypeScriptDocumentsPluginConfig } from '@graphql-codegen/typescript-operations';
import type { ReactApolloRawPluginConfig } from '@graphql-codegen/typescript-react-apollo/typings/config';
import { DocumentMode } from '@graphql-codegen/visitor-plugin-common';

const introspectionConfig: FragmentMatcherConfig = {};

const nearOperationPresetConfig: NearOperationFileConfig = {
    extension: '.api.ts',
    baseTypesPath: 'apolloClient.types.ts',
    importTypesNamespace: 'SchemaTypes',
};

const nearOperationPluginsConfig: TypeScriptDocumentsPluginConfig & ReactApolloRawPluginConfig = {
    useTypeImports: true,
    dedupeFragments: true,
    documentMode: DocumentMode.graphQLTag,
    inlineFragmentTypes: 'combine',
    pureMagicComment: true,
    nonOptionalTypename: true,
    preResolveTypes: false,
};

const typescriptPluginConfig: TypeScriptPluginConfig = {
    nonOptionalTypename: true,
    scalars: {
        ObjectID: 'string',
        DateTime: 'string | Date',
        Upload: 'File',
    },
};

const config: CodegenConfig = {
    schema: '../backend/schema/**/*.graphql',
    generates: {
        './src/apolloClient.introspection.ts': {
            documents: './src/**/*.graphql',
            plugins: ['fragment-matcher'],
            config: introspectionConfig,
        },

        './src/apolloClient.types.ts': {
            plugins: ['typescript'],
            config: typescriptPluginConfig,
        },

        './src/': {
            documents: './src/**/*.graphql',
            preset: 'near-operation-file',
            presetConfig: nearOperationPresetConfig,
            plugins: ['typescript-operations', 'typescript-react-apollo'],
            config: nearOperationPluginsConfig,
        },
    },
};

export default config;
