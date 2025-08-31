import mapValues from 'lodash/fp/mapValues.js';
import { withTrailing } from './decorators.js';
import * as enums from './enums.js';
import { type GqlResolvers } from './resolver-types.js';

// compose the resolvers
const { default: types } = await import('./types/index.js');
const { default: Query } = await import('./queries/index.js');
const { default: Mutation } = await import('./mutations/index.js');
const { default: Subscription } = await import('./subscriptions/index.js');

const resolvers: GqlResolvers = {
    ...enums,
    ...types,
    Query: mapValues(withTrailing, Query),
    Mutation: mapValues(withTrailing, Mutation),
    Subscription,
};

export default resolvers;
