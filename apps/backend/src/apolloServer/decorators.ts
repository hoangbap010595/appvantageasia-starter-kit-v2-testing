import TrailWithGql from './TrailWithGql.js';
import type { Context } from './mapped-types.js';
import type { Resolver, ResolverFn } from './resolver-types.js';

type MakeRequired<T, K extends keyof T> = T & { [P in K]-?: NonNullable<T[P]> };

export type ContextWithUser = MakeRequired<Context, 'user'>;

export const requiresLoggedUser =
    <
        ResolverType extends Resolver<any, any, Context, any> | undefined,
        TResult = ResolverType extends Resolver<infer X, any, any, any> ? X : never,
        TParent = ResolverType extends Resolver<any, infer X, any, any> ? X : never,
        TArgs = ResolverType extends Resolver<any, any, any, infer X> ? X : never,
    >(
        resolver: ResolverFn<TResult, TParent, ContextWithUser, TArgs>
    ): ResolverFn<TResult, TParent, Context, TArgs> =>
    async (root, args, context, info) => {
        if (!context.user) {
            throw new Error('Not authorized');
        }

        return resolver(root, args, context as ContextWithUser, info);
    };

export const withTrailing =
    <
        ResolverType extends Resolver<any, any, Context, any> | undefined,
        TResult = ResolverType extends Resolver<infer X, any, any, any> ? X : never,
        TParent = ResolverType extends Resolver<any, infer X, any, any> ? X : never,
        TArgs = ResolverType extends Resolver<any, any, any, infer X> ? X : never,
    >(
        resolver: ResolverFn<TResult, TParent, ContextWithUser, TArgs>
    ): ResolverFn<TResult, TParent, Context, TArgs> =>
    async (root, args, context, info) => {
        const { user } = context;

        const trail = new TrailWithGql().info().graphql(info).eventType('INVOKE_API');

        if (user) {
            // we want to know which user invoked the API
            trail.user(user);
        }

        await trail.save();

        return resolver(root, args, context as ContextWithUser, info);
    };
