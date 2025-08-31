import * as client from 'prom-client';

const { Registry, collectDefaultMetrics } = client;
const register = new Registry();

collectDefaultMetrics({ register });

export default register;
