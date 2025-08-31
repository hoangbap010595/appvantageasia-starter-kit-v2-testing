import { msalAuthentication, type UserDocument } from '@appvantageasia/core-users';
import AuthBaseFlow from './BaseFlow.js';

class MSALFlow extends AuthBaseFlow {
    public async updateProfileOnAuthentication(user: UserDocument) {
        return msalAuthentication.upsertProfile(user);
    }
}

export default MSALFlow;
