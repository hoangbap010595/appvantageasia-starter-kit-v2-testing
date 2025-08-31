import Otp from '../src/templates/Otp.jsx';

export default function Email() {
    return <Otp otp={{ code: '123456', leftTime: 10 }} />;
}
