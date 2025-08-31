import type { UserDocument } from '@appvantageasia/core-users';
import { Text, Link } from '@react-email/components';
import EDMLayout from './components/EDMLayout/index.jsx';

export interface ResetPasswordProps {
    user: UserDocument;
    url: string;
}

const ResetPassword = ({ url, user }: ResetPasswordProps) => (
    <EDMLayout>
        <Text>
            We have received a request to reset the password for your account {user.name}. If you did not request this
            change or no longer wish to reset your password, please disregard this email.
        </Text>
        <Text>
            To proceed with resetting your password, please use the link below. Note that this link will expire in 15
            minutes.
        </Text>
        <Text>
            <Link href={url} className="!underline">
                Reset Password now
            </Link>
        </Text>
    </EDMLayout>
);

export default ResetPassword;
