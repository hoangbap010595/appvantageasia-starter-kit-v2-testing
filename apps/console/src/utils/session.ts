import dayjs from 'dayjs';
import PubSub from 'pubsub-js';
import extractFromJWT from './extractFromJWT';

const storageKey = 'appvantage.session';

export const getToken = (validateToken = false) => {
    const token = localStorage.getItem(storageKey) || null;

    if (validateToken && token && dayjs().isAfter(extractFromJWT(token).exp * 1000)) {
        // token already expired
        // set it back to null
        updateToken(null);

        // then return null in such situation
        return null;
    }

    return token;
};

export const updateToken = (token: string | null) => {
    if (!token) {
        localStorage.removeItem(storageKey);
    } else {
        localStorage.setItem(storageKey, token);
    }

    PubSub.publish(`${storageKey}.update`, token);
};

export const onTokenUpdate = (callback: (token: string | null) => unknown) => {
    const subscriptionToken = PubSub.subscribe(`${storageKey}.update`, (_, token) => callback(token));

    return () => {
        PubSub.unsubscribe(subscriptionToken);
    };
};

export const onUnauthenticatedError = (callback: () => unknown) => {
    const subscriptionToken = PubSub.subscribe(`${storageKey}.unauthenticated`, callback);

    return () => {
        PubSub.unsubscribe(subscriptionToken);
    };
};

export const triggerUnauthenticatedError = () => {
    updateToken(null);
    PubSub.publish(`${storageKey}.unauthenticated`);
};
