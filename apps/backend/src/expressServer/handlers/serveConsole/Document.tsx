import type { getTraceData } from '@sentry/node';
import isEmpty from 'lodash/fp/isEmpty.js';
import type { Runtime } from './getRuntime.js';
import { makeLink, type Manifest } from './helpers.js';

export interface DocumentProps {
    runtime: Runtime;
    lang?: string;
    body: string;
    manifest: Manifest;
    sentryTraceData?: ReturnType<typeof getTraceData>;
}

const Document = ({ runtime, body, lang = 'en', manifest, sentryTraceData }: DocumentProps) => (
    <html lang={lang}>
        <head>
            <title>starter-kit-v2</title>
            <meta content="width=device-width, initial-scale=1.0" name="viewport" />
            {!isEmpty(sentryTraceData) && (
                <>
                    <meta name="sentry-trace" content={sentryTraceData['sentry-trace']} />
                    <meta name="baggage" content={sentryTraceData.baggage} />
                </>
            )}
            <link href={makeLink('/logo/favicon.png')} rel="icon" type="image/x-icon" />
            <script
                dangerouslySetInnerHTML={{ __html: JSON.stringify(runtime) }}
                data-role="runtime-config"
                type="application/json"
            />
        </head>
        <body className="w-screen min-h-screen">
            <div dangerouslySetInnerHTML={{ __html: body }} className="w-full h-screen" id="root" />
            {manifest.links.map((props, index) => (
                <link {...props} key={index.toString()} />
            ))}
            {manifest.scripts.map((props, index) => (
                <script {...props} key={index.toString()} />
            ))}
        </body>
    </html>
);

export default Document;
