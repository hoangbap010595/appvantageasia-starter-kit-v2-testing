import { createLoaders } from '@appvantageasia/core-dataloaders';
import { expressMiddleware } from '@as-integrations/express4';
import type { RequestHandler, Request, Response } from 'express';
import requestIp from 'request-ip';
import createLazyUserAbility from '../../abilities/createLazyUserAbility.js';
import apolloServer from '../../apolloServer/index.js';
import type { Context } from '../../apolloServer/mapped-types.js';
import { getUserContextFromRequest } from '../session.js';

export const getContext = async (req: Request, res: Response) => {
    const userContext = await getUserContextFromRequest(req);

    if (userContext === false) {
        // todo
        throw new Error('Unauthorized');
    }

    const dataLoader = createLoaders();

    const ip = requestIp.getClientIp(req);

    const graphqlContext: Context = {
        user: userContext?.user || null,
        session: userContext?.session || null,
        getAbilities: createLazyUserAbility(userContext?.user),
        userAgent: req.get('user-agent'),
        dataLoader,
        hostname: req.hostname,
        ip,
        http: { req, res },
    };

    return graphqlContext;
};

const serveApolloServer: RequestHandler = expressMiddleware(apolloServer, {
    context: async ({ req, res }) => getContext(req, res),
});

export default serveApolloServer;
