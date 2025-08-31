import { otpAuthentication } from '@appvantageasia/core-users';
import { requiresLoggedUser } from '../../decorators.js';
import { type GqlQueryResolvers } from '../../resolver-types.js';
import throwPermissionDenied from '../../throwPermissionDenied.js';

const resolver = requiresLoggedUser<GqlQueryResolvers['generateAuthenticatorQrCode']>(
    async (_root, _, context, info) => {
        const { user, getAbilities } = context;

        const abilities = await getAbilities();

        if (!abilities.canReadUserSensitiveData(user)) {
            return throwPermissionDenied(info);
        }

        return otpAuthentication.generateAuthenticatorQrCode(user);
    }
);

export default resolver;
