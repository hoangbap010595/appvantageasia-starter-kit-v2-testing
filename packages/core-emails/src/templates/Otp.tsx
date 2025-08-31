import { Text } from '@react-email/components';
import EDMLayout from './components/EDMLayout/index.jsx';

export interface OtpProps {
    otp: { code: string; leftTime: number };
}

const Otp = ({ otp }: OtpProps) => (
    <EDMLayout>
        <Text data-cy="otp" className="font-semibold">
            Your OTP is: {otp.code}
        </Text>
        <Text className="!mt-0"> (This code will expire in {otp.leftTime} minutes)</Text>
    </EDMLayout>
);

export default Otp;
