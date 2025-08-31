import { getBroker } from '@appvantageasia/core-broker';

const broker = await getBroker();

const services = {
    dummy: () => import('@appvantageasia/service-vendor-dummy').then(module => module.createServices(broker)),
};

export type ServiceName = keyof typeof services;

export const createServices = async (serviceNames = Object.keys(services) as ServiceName[]) => {
    await Promise.all(serviceNames.map(async serviceName => services[serviceName]()));
};

export default broker;
