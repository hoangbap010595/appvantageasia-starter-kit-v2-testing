import type { TFunction } from 'i18next';

export interface Requirement {
    description: string;
    regex: RegExp;
}

const requirements = (t: TFunction): Requirement[] => [
    {
        description: t('loginPage:passwordSettings.requirements.error.atLeastUpperCase', { min: '1', range: '[A-Z]' }),
        regex: /[A-Z]/,
    },
    {
        description: t('loginPage:passwordSettings.requirements.error.atLeastLowerCase', { min: '1', range: '[a-z]' }),
        regex: /[a-z]/,
    },
    {
        description: t('loginPage:passwordSettings.requirements.error.atLeastNumber', { min: '1', range: '[0-9]' }),
        regex: /[0-9]/,
    },

    {
        description: t('loginPage:passwordSettings.requirements.error.atLeastSpecialCharacter', {
            min: '1',
            range: "[!@#^&*()={}[]';,.?-]",
        }),
        regex: /[!@#^&*()={}[\]';,.?-]/,
    },
    {
        description: t('loginPage:passwordSettings.requirements.error.atLeastCharacter', {
            size: '14',
        }),
        regex: /.{14,}/,
    },
];

export default requirements;
