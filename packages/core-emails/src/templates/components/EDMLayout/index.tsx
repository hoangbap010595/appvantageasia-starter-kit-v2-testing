import { Head, Tailwind, Container, Img, Font, Html } from '@react-email/components';
import type * as React from 'react';
import urlJoin from 'url-join';
import * as config from '../../../config.js';
import Footer from './Footer.jsx';

const fonts: React.ComponentProps<typeof Font>[] = [
    /* custom fonts can be added there */
];

interface EDMLayoutProps {
    children: React.ReactNode;
}

const EDMLayout = ({ children }: EDMLayoutProps) => (
    <Html>
        <Head title="subject">
            {fonts.map((font, index) => (
                <Font key={index.toString()} {...font} />
            ))}
        </Head>
        <Tailwind config={{}}>
            <Container className="m-auto">
                <Img
                    className="mx-auto w-auto h-20 object-contain my-8"
                    src={urlJoin(config.spaConsoleCdn, 'logo/rectangle/black.png')}
                />
                {children}
                <Footer />
            </Container>
        </Tailwind>
    </Html>
);

export default EDMLayout;
