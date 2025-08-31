import type { Readable } from 'node:stream';
import { getCollections, Trail } from '@appvantageasia/core-trail';
import JSONStream from 'JSONStream';
import dayjs from 'dayjs';
import type { RequestHandler } from 'express';
import zod from 'zod';
import getAbilities from '../abilities/getAbilities.js';
import { getUserContextFromRequest } from './session.js';

const bodySchema = zod.object({
    start: zod.string().date(),
    end: zod.string().date(),
});

type BodySchema = zod.output<typeof bodySchema>;

const downloadAuditTrail: RequestHandler<any, any, BodySchema> = async (request, response, next) => {
    // we first look to verify the user session
    const context = await getUserContextFromRequest(request);

    // create a trail object to keep track of this API being called
    const trail = new Trail()
        .warn()
        .anonymous()
        .setSpec('request', { url: request.url })
        .eventType('PERMISSION_DENIED');

    if (!context) {
        await trail.save();
        response.status(403).send('Forbidden');
        return;
    }

    // then we verify capabilities
    const abilities = await getAbilities(context.user);

    if (!abilities.canManageSystem()) {
        await trail.user(context.user).save();
        response.status(403).send('Forbidden');
        return;
    }

    // finally we verify the payload
    const query = await bodySchema.safeParseAsync(request.body);

    if (!query.success) {
        await trail.user(context.user).eventType('INVALID_REQUEST').save();
        response.status(401).send('Invalid request');
        return;
    }

    const { trails } = await getCollections();
    const { start, end } = query.data;
    const startOfDay = dayjs(start).startOf('day').toDate();
    const endOfDay = dayjs(end).endOf('day').toDate();

    // save the trail
    await trail.info().eventType('AUDIT_TRAIL_DOWNLOAD').user(context.user).setSpec('request', { start, end }).save();

    // as the trail may be quite heavy we are going to use a stream for it
    const stream: Readable = trails
        .find({ date: { $gte: startOfDay, $lte: endOfDay } })
        .sort({ date: -1 })
        .stream({
            transform: ({ _id, ...rest }) => ({ id: _id.toHexString(), ...rest }),
        })
        .pipe(JSONStream.stringify() as any);

    // set headers
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Content-Disposition', 'attachment');

    // capture error from the stream
    stream.on('error', (error: any) => {
        console.error(error);
        next(error);
    });

    // finally pipe the stream to the response
    stream.pipe(response);
};

export default downloadAuditTrail;
