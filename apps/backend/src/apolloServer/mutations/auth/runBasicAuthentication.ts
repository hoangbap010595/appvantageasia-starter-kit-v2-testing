import { getCollections } from '@appvantageasia/core-users';
import getSSO from '../../../utils/getSSO.js';
import type { GqlMutationResolvers } from '../../resolver-types.js';
import AuthLocalFlow from './AuthFlows/LocalFlow.js';

const resolver: GqlMutationResolvers['runBasicAuthentication'] = async (root, args, context, info) => {
    const { email } = args;
    const { users } = await getCollections();
    const user = await users.findOne({ email: email.toLowerCase() });

    const flow = new AuthLocalFlow(context, info);

    const sso = await getSSO();

    if (sso?.enforced) {
        await flow.saveTrailOnFailure({ email, failure: 'SSO_ENFORCED' });

        return {
            __typename: 'ErrorResponse',
            fields: [{ field: '$root', message: 'SSO is enforced' }],
        };
    }

    if (!user) {
        await flow.saveTrailOnFailure({ submittedEmail: email, failure: 'UNMATCHED_EMAIL' });

        return {
            __typename: 'ErrorResponse',
            fields: [
                { field: 'email', message: '' },
                { field: 'password', message: 'Invalid email or password' },
            ],
        };
    }

    // proceed without organization logic
    return flow.signIn(user, args);
};

export default resolver;
