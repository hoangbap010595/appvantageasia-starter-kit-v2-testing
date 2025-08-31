import type { UserDocument } from '@appvantageasia/core-users';
import ResetPassword from '../src/templates/ResetPassword.jsx';

export default function Email() {
    return <ResetPassword url="https://www.google.com" user={{ name: 'John Doe' } as UserDocument} />;
}
