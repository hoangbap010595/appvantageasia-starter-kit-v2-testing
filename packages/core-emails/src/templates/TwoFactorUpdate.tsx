import { Text } from '@react-email/components';
import { appName } from '../config.js';
import EDMLayout from './components/EDMLayout/index.jsx';

export interface PasswordUpdateProps {
    enable: boolean;
}

const TwoFactorUpdate = ({ enable }: PasswordUpdateProps) => (
    <EDMLayout>
        <Text>
            Two-factor authentication has been {enable ? 'enabled' : 'disabled'} for your account on {appName}.
        </Text>
        <Text>
            If you made this change, no action is needed. If not, please contact your Workspace Owner or Admin
            immediately.
        </Text>
    </EDMLayout>
);

export default TwoFactorUpdate;
