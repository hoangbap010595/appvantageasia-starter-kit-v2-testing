import qrcode from 'qrcode';
import { useEffect, useState } from 'react';

interface QrCodeImageProps {
    data?: string;
    qrCodeOptions?: { width?: number; margin?: number };
}

const QrCodeImage = ({ data, qrCodeOptions }: QrCodeImageProps) => {
    const [qrCodeImageUrl, setQrCodeImageUrl] = useState<string>();

    useEffect(() => {
        const generateQrCodeImageUrl = async () =>
            new Promise<void>(resolve => {
                if (!data) {
                    setQrCodeImageUrl(undefined);
                    resolve();

                    return;
                }

                qrcode.toDataURL(
                    data,
                    qrCodeOptions ?? { margin: 0 },
                    (error: Error | null | undefined, imageUrl: string) => {
                        if (!error) {
                            setQrCodeImageUrl(imageUrl);
                            resolve();
                        }
                    }
                );
            });

        generateQrCodeImageUrl();
    }, [data, qrCodeOptions]);

    return <img alt="qrCode" src={qrCodeImageUrl ?? 'error'} />;
};

export default QrCodeImage;
