import { Hr, Text, Container } from '@react-email/components';
import { appName } from '../../../config.js';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Container className="m-auto">
            <Hr />
            <Text>© {currentYear} Appvantage. All Rights Reserved.</Text>
            <Container className="bg-black py-4 px-6 mt-8">
                <Text className="text-white">
                    This e-mail has been generated automatically. Direct replies are not possible. {appName} is not
                    responsible for any content published on external websites.
                </Text>
            </Container>
        </Container>
    );
};

export default Footer;
