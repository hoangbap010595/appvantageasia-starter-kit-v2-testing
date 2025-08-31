import { oidcAuthentication, type UserDocument } from '@appvantageasia/core-users';
import AuthBaseFlow from './BaseFlow.js';

class OIDCFlow extends AuthBaseFlow {
    public async updateProfileOnAuthentication(user: UserDocument) {
        return oidcAuthentication.upsertProfile(user);
    }
}

export default OIDCFlow;
