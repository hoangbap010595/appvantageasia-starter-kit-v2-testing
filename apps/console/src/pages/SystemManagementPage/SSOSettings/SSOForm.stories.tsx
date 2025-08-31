import type { MockedResponse } from '@apollo/client/testing/core';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';
import { withRouter } from 'storybook-addon-remix-react-router';
import SSOForm from './SSOForm';
import { UpdateSsoDocument, type UpdateSsoMutationVariables, type UpdateSsoMutation } from './UpdateSSO.api';
import withStorybookApollo from '@/components/decorators/withStorybookApollo';
import withStorybookTranslation from '@/components/decorators/withStorybookTranslation';

const mocks: MockedResponse<UpdateSsoMutation, UpdateSsoMutationVariables>[] = [
    {
        request: { query: UpdateSsoDocument },
        variableMatcher: variables => !!variables.settings.oidc,
        result: variables => {
            action('submit')(variables);
            const oidc = variables.settings.oidc!;
            const response: UpdateSsoMutation = {
                __typename: 'Mutation',
                updateSSOConfiguration: {
                    __typename: 'UpdateSSOSuccessfulResponse',
                    result: {
                        __typename: 'OIDCConfiguration',
                        clientId: oidc.clientId,
                        enforced: oidc.enforced,
                        endpoint: oidc.endpoint,
                    },
                },
            };

            return { data: response };
        },
    },
    {
        request: { query: UpdateSsoDocument },
        variableMatcher: variables => !!variables.settings.msal,
        result: variables => {
            action('submit')(variables);
            const msal = variables.settings.msal!;
            const response: UpdateSsoMutation = {
                __typename: 'Mutation',
                updateSSOConfiguration: {
                    __typename: 'UpdateSSOSuccessfulResponse',
                    result: {
                        __typename: 'MSALConfiguration',
                        clientId: msal.clientId,
                        enforced: msal.enforced,
                        authority: msal.authority,
                    },
                },
            };

            return { data: response };
        },
    },
    {
        request: { query: UpdateSsoDocument },
        variableMatcher: variables => !variables.settings.msal && !variables.settings.oidc,
        result: variables => {
            action('submit')(variables);
            const response: UpdateSsoMutation = {
                __typename: 'Mutation',
                updateSSOConfiguration: {
                    __typename: 'UpdateSSOSuccessfulResponse',
                    result: null,
                },
            };

            return { data: response };
        },
    },
];

const meta: Meta<typeof SSOForm> = {
    title: 'Application/Forms/SSO',
    component: SSOForm,
    decorators: [withStorybookTranslation, withRouter, withStorybookApollo],
    parameters: {
        layout: 'padded',
        apollo: { mocks },
    },
};

type Story = StoryObj<typeof SSOForm>;

export const Default: Story = {
    args: {
        refetch: action('refetch') as any,
        initialSSO: null,
    },
};

export const OIDC: Story = {
    args: {
        refetch: action('refetch') as any,
        initialSSO: {
            __typename: 'OIDCConfiguration',
            clientId: 'oidc-client-id',
            enforced: true,
            endpoint: 'https://oidc.example.com',
        },
    },
};

export const MSAL: Story = {
    args: {
        refetch: action('refetch') as any,
        initialSSO: {
            __typename: 'MSALConfiguration',
            clientId: 'msal-client-id',
            enforced: true,
            authority: 'https://login.microsoftonline.com/common',
        },
    },
};

export default meta;
