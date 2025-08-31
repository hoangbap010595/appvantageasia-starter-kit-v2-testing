import urlJoin from 'url-join';
import { hostname } from '../config.js';

const getOIDCCallback = () => urlJoin(`https://${hostname}`, '/login/sso/oidc');

export default getOIDCCallback;
