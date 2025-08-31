import type { RequestHandler } from 'express';

const disableCache: RequestHandler = (req, res, next) => {
    // update headers to disable caching behaviors
    res.set({
        'Cache-control': 'no-store',
        Pragma: 'no-cache',
    });

    // move on to next handler
    next();
};

export default disableCache;
