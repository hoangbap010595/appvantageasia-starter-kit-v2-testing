import { useTranslation } from 'react-i18next';
import type { ProfileDataFragment } from '../FetchProfile.api';
import StepConfirm from './StepConfirm';
import StepScan from './StepScan';
import useStep from './useStep';
import { ColItem } from '@/components/blocks/FormSection';
import Button from '@/components/common/Button';

interface AuthenticatorSetupProps {
    profile: ProfileDataFragment;
    refetch: () => unknown;
}

const AuthenticatorSetup = ({ refetch }: AuthenticatorSetupProps) => {
    const { t } = useTranslation('profile');
    const [state, dispatch] = useStep();

    return (
        <>
            <ColItem>
                <Button color="primary" onClick={() => dispatch({ type: 'goScan' })}>
                    {t('profile:sections.2fa.setUpAuthenticator')}
                </Button>
            </ColItem>
            {state.stepScanOpen && (
                <StepScan
                    dispatch={dispatch}
                    open={state.stepScanOpen}
                    setOpen={(val: boolean) => dispatch({ type: 'setStepScanOpen', open: val })}
                />
            )}
            {state.stepConfirmOpen && (
                <StepConfirm
                    dispatch={dispatch}
                    open={state.stepConfirmOpen}
                    refetch={refetch}
                    setOpen={(val: boolean) => dispatch({ type: 'setStepConfirmOpen', open: val })}
                />
            )}
        </>
    );
};

export default AuthenticatorSetup;
