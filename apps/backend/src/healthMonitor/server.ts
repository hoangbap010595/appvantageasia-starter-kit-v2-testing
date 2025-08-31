import grpc from '@grpc/grpc-js';
import { HealthImplementation } from 'grpc-health-check';

// create gRPC server
const server = new grpc.Server();

// construct the service implementation
export const healthService = new HealthImplementation({ '': 'UNKNOWN' });

// then add the service to the gRPC server
healthService.addToServer(server);

export default server;
