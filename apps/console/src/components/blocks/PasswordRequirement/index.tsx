import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import requirements from '@/utils/passwordRequirement';

export const useValidatePassword = () => {
    const { t } = useTranslation('loginPage');

    return useCallback(
        (value: string) =>
            requirements(t).map(({ description, regex }) => ({
                description,
                isChecked: value ? regex.test(value) : false,
            })),
        [t]
    );
};

export interface PasswordRequirementProps {
    isChecked: boolean;
    description: string;
}

export interface PasswordRequirementListProps {
    requirements: PasswordRequirementProps[];
}

const PasswordRequirement = ({ requirements }: PasswordRequirementListProps) => {
    const { t } = useTranslation('loginPage');

    const renderItem = ({ isChecked, description }: PasswordRequirementProps) => (
        <div key={description}>
            <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center text-sm whitespace-nowrap text-gray-400">
                    {isChecked ? (
                        <CheckIcon className="mr-3 h-5 w-5 text-green-700" />
                    ) : (
                        <XMarkIcon className="mr-3 h-5 w-5 text-red-700" />
                    )}
                    {description}
                </div>
            </div>
        </div>
    );

    return (
        <div>
            <div className="text-m mb-2 font-semibold break-words text-black">
                {t('loginPage:passwordSettings.requirements.title')}
            </div>
            <div className="flex flex-row flex-wrap">
                <div className="relative min-h-1 max-w-full">{requirements.map(renderItem)}</div>
            </div>
        </div>
    );
};

export default PasswordRequirement;
