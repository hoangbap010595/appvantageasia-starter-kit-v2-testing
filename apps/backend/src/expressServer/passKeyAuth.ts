import { getCollections, webAuthnAuthentication } from '@appvantageasia/core-users';
import { Router } from 'express';
import requestIp from 'request-ip';
import { createSession, getUserContextFromRequest } from './session.js';

const router = Router();

router.post('/registration/start', async (req, res, next) => {
    try {
        const userContext = await getUserContextFromRequest(req);

        if (!userContext) {
            res.status(403).send('User not found');

            return;
        }

        const response = await webAuthnAuthentication.startRegistration(userContext.user);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.post('/registration/finalize', async (req, res, next) => {
    try {
        const userContext = await getUserContextFromRequest(req);

        if (!userContext) {
            res.status(403).send('User not found');

            return;
        }

        const { error } = await webAuthnAuthentication.finalizeRegistration(userContext.user, req.body);

        if (error) {
            res.status(403).send(error);
        } else {
            res.status(200).send('OK');
        }
    } catch (error) {
        next(error);
    }
});

router.post('/authentication/start', async (req, res, next) => {
    try {
        const { users } = await getCollections();
        const user = await users.findOne({ username: req.body.username });

        if (!user) {
            res.status(403).send('User not found');

            return;
        }

        const response = await webAuthnAuthentication.startAuthentication(user);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.post('/authentication/finalize', async (req, res, next) => {
    try {
        const { users } = await getCollections();
        const user = await users.findOne({ username: req.body.username });

        if (!user) {
            res.status(403).send('User not found');

            return;
        }

        const { error } = await webAuthnAuthentication.finalizeAuthentication(user, req.body);

        if (error) {
            res.status(403).send(error);

            return;
        }

        const ip = requestIp.getClientIp(req);

        const { token } = await createSession(user._id, { userAgent: req.get('user-agent'), ip });
        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
});

export default router;
