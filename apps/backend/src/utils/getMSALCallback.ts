import urlJoin from 'url-join';
import { hostname } from '../config.js';

const getMSALCallback = () => urlJoin(`https://${hostname}`, '/login/sso/msal');

export default getMSALCallback;
