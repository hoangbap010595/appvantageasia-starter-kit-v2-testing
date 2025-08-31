export type {
    AuthProfileDocument,
    LocalAuthProfileDocument,
    OTPAuthProfileDocument,
    MSALAuthProfileDocument,
    MSALConfig,
    OIDCAuthProfileDocument,
    OIDCConfig,
} from './types.js';

export { default as LocalAuthentication } from './authModules/LocalAuthentication.js';

export { default as OTPAuthentication } from './authModules/OTPAuthentication.js';

export { default as MSALAuthentication } from './authModules/MSALAuthentication.js';

export { default as OIDCAuthentication, type OIDCState } from './authModules/OIDCAuthentication.js';

export { default as WebAuthnAuthentication } from './authModules/WebAuthnAuthentication.js';
