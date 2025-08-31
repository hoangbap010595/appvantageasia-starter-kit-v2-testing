import { otpAuthentication } from '@appvantageasia/core-users';
import { sendTwoFactorUpdate } from '@appvantageasia/service-notifications';
import { requiresLoggedUser } from '../../decorators.js';
import type { GqlMutationResolvers } from '../../resolver-types.js';
import throwPermissionDenied from '../../throwPermissionDenied.js';

const resolver = requiresLoggedUser<GqlMutationResolvers['disableAuthenticator']>(async (root, args, context, info) => {
    const { getAbilities, user } = context;

    const abilities = await getAbilities();

    const profile = otpAuthentication.getProfile(user);

    if (!abilities.canUpdateUserSensitiveData(user) || !profile?.secret) {
        return throwPermissionDenied(info, user);
    }

    await otpAuthentication.disableAuthenticator(user);
    await sendTwoFactorUpdate({ userId: user._id });

    return true;
});

export default resolver;
