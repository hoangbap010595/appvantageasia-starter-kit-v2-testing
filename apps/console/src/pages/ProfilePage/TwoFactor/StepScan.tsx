import type { Dispatch } from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useGenerateAuthenticatorQrCodeQuery } from './GenerateAuthenticatorQrCode.api';
import type { Action } from './useStep';
import Loader from '@/components/common/Loader';
import Modal from '@/components/common/Modal';
import type { ModalProps } from '@/components/common/Modal';
import Space from '@/components/common/Space';

type StepScanProps = Pick<ModalProps, 'open'> & {
    dispatch: Dispatch<Action>;
    setOpen: (state: boolean) => void;
};

const StepScan = ({ open, setOpen, dispatch }: StepScanProps) => {
    const { t } = useTranslation('leads');
    const { data, loading } = useGenerateAuthenticatorQrCodeQuery({ fetchPolicy: 'no-cache' });

    const onSubmit = useCallback(async () => {
        dispatch({ type: 'goConfirm' });
    }, [dispatch]);

    if (!data && loading) {
        return <Loader />;
    }

    return (
        <Modal
            className="sm:!w-96"
            dataCy="otpStepScanModal"
            okText={t('profile:sections.2fa.stepScan.next')}
            onClose={() => {
                dispatch({ type: 'reset' });
                setOpen(false);
            }}
            onOk={onSubmit}
            open={open}
            title={t('profile:sections.2fa.stepScan.title')}
        >
            <Space direction="vertical">
                <span className="text-sm text-black">{t('profile:sections.2fa.stepScan.text')}</span>

                <div className="flex items-center justify-center">
                    <img alt="qrcode" className="w-40" src={data?.result} />
                </div>
            </Space>
        </Modal>
    );
};

export default StepScan;
