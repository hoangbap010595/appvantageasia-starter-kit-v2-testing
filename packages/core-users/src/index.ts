export { default as getCollections, type UserDocument, type UserSession } from './getCollections.js';

export * as sessions from './sessions.js';

export { default as patchAbilities } from './patchAbilities.js';

export { default as migrations } from './migrations/index.js';

export { default as localAuthentication } from './auth/localAuthentication.js';

export { default as otpAuthentication } from './auth/otpAuthentication.js';

export { default as msalAuthentication } from './auth/msalAuthentication.js';

export { default as oidcAuthentication } from './auth/oidcAuthentication.js';

export { default as webAuthnAuthentication } from './auth/webAuthnAuthentication.js';
