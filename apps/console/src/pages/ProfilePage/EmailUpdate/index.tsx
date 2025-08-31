import { PencilSquareIcon } from '@heroicons/react/20/solid';
import { Suspense, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { ProfileDataFragment } from '../FetchProfile.api';
import StepChange from './StepChange';
import StepConfirm from './StepConfirm';
import StepVerify from './StepVerify';
import useStep from './useStep';
import InputField from '@/components/fields/InputField';

interface EmailUpdateProps {
    profile: ProfileDataFragment;
    refetch: () => unknown;
}

const EmailUpdate = ({ profile, refetch }: EmailUpdateProps) => {
    const { t } = useTranslation('profile');
    const [state, dispatch] = useStep();

    let step: ReactNode = null;

    if (state.stepChangeOpen) {
        step = (
            <StepChange
                dispatch={dispatch}
                newEmail={state.newEmail}
                open={state.stepChangeOpen}
                profile={profile}
                setOpen={(val: boolean) => dispatch({ type: 'setStepChangeOpen', open: val })}
            />
        );
    } else if (state.stepVerifyOpen) {
        step = (
            <StepVerify
                dispatch={dispatch}
                newEmail={state.newEmail}
                open={state.stepVerifyOpen}
                setOpen={(val: boolean) => dispatch({ type: 'setStepVerifyOpen', open: val })}
            />
        );
    } else if (state.stepConfirmOpen) {
        step = (
            <StepConfirm
                dispatch={dispatch}
                newEmail={state.newEmail}
                open={state.stepConfirmOpen}
                profile={profile}
                refetch={refetch}
                setOpen={(val: boolean) => dispatch({ type: 'setStepConfirmOpen', open: val })}
            />
        );
    }

    return (
        <div>
            <InputField
                {...t('profile:sections.mainDetails.fields.email', { returnObjects: true })}
                name="email"
                disabled
                onSuffixClick={() => dispatch({ type: 'goChange' })}
                suffixElement={<PencilSquareIcon className="size-5" />}
            />
            <Suspense>{step}</Suspense>
        </div>
    );
};

export default EmailUpdate;
