import { type GraphQLResolveInfo } from 'graphql';
import pick from 'lodash/fp/pick.js';
import createLazyUserAbility from '../../../../abilities/createLazyUserAbility.js';
import { createSession } from '../../../../expressServer/session.js';
import TrailWithGql from '../../../TrailWithGql.js';
import type { Context, UserDocument } from '../../../mapped-types.js';
import type { GqlResolversTypes } from '../../../resolver-types.js';

export enum TokenType {
    ResetPassword = 'authenticationWithResetPassword',
    TOTP = 'authenticationWithTOTP',
    RequestNewPassword = 'requestNewPassword',
}

abstract class AuthBaseFlow {
    public readonly context: Context;

    public readonly info: GraphQLResolveInfo;

    constructor(context: Context, info: GraphQLResolveInfo) {
        this.context = context;
        this.info = info;
    }

    public async saveTrailOnFailure(specContext: any, user?: UserDocument) {
        const { info } = this;

        const trail = new TrailWithGql()
            .warn()
            .anonymous()
            .graphql(info)
            .eventType('FAILED_AUTHENTICATION')
            .setSpec('context', specContext);

        if (user) {
            trail.user(user);
        }

        await trail.save();
    }

    public abstract updateProfileOnAuthentication(user: UserDocument): Promise<UserDocument>;

    public async finalizeAuthentication(user: UserDocument): Promise<GqlResolversTypes['BasicAuthenticationResponse']> {
        const { context, info } = this;

        const updatedUser = await this.updateProfileOnAuthentication(user);

        const { token } = await createSession(user._id, pick(['userAgent', 'ip'], context));

        await new TrailWithGql().info().eventType('AUTHENTICATED').user(user).graphql(info).save();

        // forcefully update the grapghl context for later resolutions
        context.getAbilities = createLazyUserAbility(user);
        context.user = updatedUser;

        return {
            __typename: 'BasicAuthenticationSuccessfulResponse',
            token,
            user: updatedUser,
        };
    }
}

export default AuthBaseFlow;
