import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { useServer } from 'graphql-ws/use/ws';
import { WebSocketServer } from 'ws';
import { httpServer } from '../expressServer/instance.js';
import type { Context } from './mapped-types.js';
import schema from './schema.js';
import sentryPlugin from './sentryPlugin.js';

// Creating the WebSocket server
const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/api/subscriptions',
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
// we disable eslint rules on that because it's not a react hook
// eslint-disable-next-line react-hooks/rules-of-hooks
const serverCleanup = useServer({ schema }, wsServer);

// instance the apollo server
const server = new ApolloServer<Context>({
    schema,
    plugins: [
        // Proper shutdown for the HTTP server.
        ApolloServerPluginDrainHttpServer({ httpServer }),

        // Proper shutdown for the WebSocket server.
        {
            async serverWillStart() {
                return {
                    async drainServer() {
                        await serverCleanup.dispose();
                    },
                };
            },
        },

        sentryPlugin,
    ],
});

// we you must call `start()` on the `ApolloServer`
// instance before passing the instance to `expressMiddleware`
await server.start();

export default server;
