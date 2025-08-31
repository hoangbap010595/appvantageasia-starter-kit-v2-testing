/// <reference path="../../../types/bundler.d.ts" />
import * as Sentry from '@sentry/node';
import type { RequestHandler } from 'express';
import { renderToStaticMarkup } from 'react-dom/server';
import Document from './Document.js';
import getRuntime from './getRuntime.js';
import { getManifest, getCspRule } from './helpers.js';

const handler: RequestHandler = async (req, res, next) => {
    try {
        // first retrieve the manifest
        // it will list all assets that need to be included in our document
        const manifest = await getManifest();

        // get runtime object
        const runtime = await getRuntime(req);

        // get sentry traching
        const sentryTraceData = Sentry.getTraceData();

        // get the document element ready
        const documentElement = (
            <Document body="" manifest={manifest} runtime={runtime} sentryTraceData={sentryTraceData} />
        );

        // we are looking for statuc markdown only
        const documentHtml = renderToStaticMarkup(documentElement);

        // we are required to add the doctype
        const html = `<!doctype html>${documentHtml}`;

        // apply best practices for security
        res.set({
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'SAMEORIGIN',
            'X-Xss-Protection': '"1; mode=block"',
            'Content-Security-Policy': getCspRule(manifest),
            'Referrer-Policy': 'no-referrer',
            'Permissions-Policy': 'geolocation=()',
        });

        if (runtime.useProfiling) {
            res.set('Document-Policy', 'js-profiling');
        }

        res.send(html);
    } catch (error) {
        // forward the error
        next(error);
    }
};

export default handler;
