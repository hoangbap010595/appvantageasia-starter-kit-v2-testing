import cors from 'cors';
import type { Request } from 'express';

const applyCors = cors<Request>((req, callback) => {
    // in production we expect the app to be served behind a reverse proxy such as the ingress controller
    // if so we rely on those information which are trust worthy as those are defined by the proxy itself
    const host = req.header('X-Forwarded-Host');
    const scheme = req.header('X-Forwarded-Scheme') || 'https';

    // apply cors
    callback(null, { origin: host ? `${scheme}://${host}` : false });
});

export default applyCors;
