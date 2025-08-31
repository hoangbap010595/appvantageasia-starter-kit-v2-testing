import { localAuthentication, type UserDocument } from '@appvantageasia/core-users';
import type { ObjectId } from 'mongodb';
import { generateToken } from '../../../../expressServer/token.js';
import type { GqlResolversTypes } from '../../../resolver-types.js';
import AuthBaseFlow, { TokenType } from './BaseFlow.js';

class AuthLocalFlow extends AuthBaseFlow {
    public async updateProfileOnAuthentication(user: UserDocument) {
        return localAuthentication.updateLastUsedAt(user);
    }

    private getRequireOtpResponse(user: UserDocument): GqlResolversTypes['BasicAuthenticationResponse'] {
        const token = generateToken<{ userId: ObjectId }>(TokenType.TOTP, { userId: user._id }, 10 * 60);

        return {
            __typename: 'BasicAuthenticationRequireOtpResponse',
            token,
        };
    }

    private getResetPasswordResponse(user: UserDocument): GqlResolversTypes['BasicAuthenticationResponse'] {
        const token = generateToken<{ userId: ObjectId }>(TokenType.ResetPassword, { userId: user._id }, 10 * 60);

        return {
            __typename: 'BasicAuthenticationResetPasswordResponse',
            token,
        };
    }

    public async postOtpControls(user: UserDocument) {
        if (localAuthentication.checkIsPasswordExpired(user)) {
            return this.getResetPasswordResponse(user);
        }

        return this.finalizeAuthentication(user);
    }

    public async signIn(
        user: UserDocument,
        auth: { email: string; password: string }
    ): Promise<GqlResolversTypes['BasicAuthenticationResponse']> {
        const result = await localAuthentication.authenticate(user, auth.password);

        if (result === 'require-otp') {
            return this.getRequireOtpResponse(user);
        }

        if (result === 'reset-password') {
            return this.getResetPasswordResponse(user);
        }

        if (result === false) {
            await this.saveTrailOnFailure({ email: auth.email, failure: 'INVALID_PASSWORD' });

            return {
                __typename: 'ErrorResponse',
                fields: [
                    { field: 'email', message: '' },
                    { field: 'password', message: 'Invalid email or password' },
                ],
            };
        }

        return this.finalizeAuthentication(user);
    }
}

export default AuthLocalFlow;

export { TokenType } from './BaseFlow.js';
