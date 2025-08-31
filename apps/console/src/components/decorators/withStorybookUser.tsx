import type { ReactNode } from 'react';
import { makeDecorator } from 'storybook/preview-api';
import type { ContextValue } from '@/contexts/UserSession';
import { Context } from '@/contexts/UserSession';
import type { CurrentUserFragment } from '@/contexts/UserSession/Usersession.api';

export const adminUser: CurrentUserFragment = {
    __typename: 'User',
    email: 'admin@appvantage.co',
    id: '424242',
    name: 'Admin',
    isSuperAdmin: true,
    memberships: [],
};

export const createContext = (user: CurrentUserFragment): ContextValue => ({
    token: 'fake-token',
    user,
    sessionId: 'fake-session-id',
    logout: () => {
        // No-op
    },
});

const withStorybookUser = makeDecorator({
    name: 'withStorybookUser',
    parameterName: 'user',
    wrapper: (getStory, context, { parameters }) => (
        <Context.Provider value={parameters as ContextValue}>{getStory(context) as ReactNode}</Context.Provider>
    ),
});

export default withStorybookUser;
