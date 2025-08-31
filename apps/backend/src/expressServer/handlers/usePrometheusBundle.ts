import prometheusBundle from 'express-prom-bundle';
import register from '../../prometheus/register.js';

const expressMiddleware = prometheusBundle({
    includeMethod: true,
    promRegistry: register,
    autoregister: false,
});

export default expressMiddleware;
