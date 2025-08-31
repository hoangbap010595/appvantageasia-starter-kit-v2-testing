import type { ServingStatus } from 'grpc-health-check';

export interface HealthMonitor {
    name: string;
    run: () => Promise<{ state: ServingStatus; messages?: string[] }>;
}

const enabledMonitors: HealthMonitor[] = [];

export const getMonitors = () => enabledMonitors;

export const registerMonitor = (...monitors: HealthMonitor[]) => {
    enabledMonitors.push(...monitors);
};
