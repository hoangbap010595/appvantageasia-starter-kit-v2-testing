import { Text } from '@react-email/components';
import { appName } from '../config.js';
import EDMLayout from './components/EDMLayout/index.jsx';

const PasswordUpdate = () => (
    <EDMLayout>
        <Text>Your account password on {appName} has been successfully changed.</Text>
        <Text>
            If you made this change, no action is needed. If you did not change your password, please contact your
            Workspace Owner or Admin immediately.
        </Text>
    </EDMLayout>
);

export default PasswordUpdate;
