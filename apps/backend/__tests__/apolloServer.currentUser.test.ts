import type { SnapshotController } from '@appvantageasia/e2e-snapshots';
import loadSnapshots from '@appvantageasia/e2e-snapshots';
import { gql } from 'graphql-tag';
import { beforeEach, describe, test, expect } from 'vitest';
import currentUserResolver from '../src/apolloServer/queries/auth/currentUser.js';
import type { GqlResolvers } from '../src/apolloServer/resolver-types.js';
import UserResolver from '../src/apolloServer/types/User.js';
import createApolloServer from './createApolloServer.js';

let helpers: SnapshotController;

beforeEach(async () => {
    helpers = await loadSnapshots('baseUsers');
});

describe('apollo.Query.currentUser', () => {
    const resolvers: GqlResolvers = {
        User: UserResolver,
        Query: { currentUser: currentUserResolver },
    };

    test('should return the authenticated user', async () => {
        const { executeOperation } = await createApolloServer(resolvers);

        const query = gql`
            query CurrentUser {
                currentUser {
                    id
                }
            }
        `;

        const user = await helpers.users.findByE2eId('super-admin');
        const response = await executeOperation(query, {}, { user });

        expect(response.body.kind).toBe('single');

        if (response.body.kind === 'single') {
            expect(response.body.singleResult.errors).toBeUndefined();
            expect(response.body.singleResult.data?.currentUser).toEqual({ id: user._id });
        }
    });

    test('should return null when no user is authenticated', async () => {
        const { executeOperation } = await createApolloServer(resolvers);

        const query = gql`
            query CurrentUser {
                currentUser {
                    id
                }
            }
        `;

        const response = await executeOperation(query, {});

        expect(response.body.kind).toBe('single');

        if (response.body.kind === 'single') {
            expect(response.body.singleResult.errors).toBeUndefined();
            expect(response.body.singleResult.data?.currentUser).toBeNull();
        }
    });
});
