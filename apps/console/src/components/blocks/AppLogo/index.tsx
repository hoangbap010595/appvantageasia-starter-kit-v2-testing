import { Link } from 'react-router';

export interface AppLogoProps {
    homePath?: string;
}

const logoBlack = new URL('@/public/logo/rectangle/black.svg', import.meta.url).href;

const logoWhite = new URL('@/public/logo/rectangle/white.svg', import.meta.url).href;

const AppLogo = ({ homePath = '/' }: AppLogoProps) => {
    return (
        <Link to={homePath}>
            <img alt="logo" className="mx-auto h-20 w-auto object-contain dark:hidden" src={logoBlack} />
            <img alt="logo" className="mx-auto h-20 w-auto object-contain not-dark:hidden" src={logoWhite} />
        </Link>
    );
};

export default AppLogo;
