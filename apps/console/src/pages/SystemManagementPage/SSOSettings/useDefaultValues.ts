import { useMemo } from 'react';
import type { SsoConfigurationDataFragment } from './UpdateSSO.api';
import type { InputValues } from './useFormSchema';

const useDefaultValues = (sso: SsoConfigurationDataFragment | null) =>
    useMemo(() => {
        const values: InputValues = { msal: null, oidc: null };

        if (!sso) {
            return values;
        }

        if (sso.__typename === 'MSALConfiguration') {
            values.msal = {
                authority: sso.authority,
                clientId: sso.clientId,
                clientSecret: '',
                enforced: sso.enforced,
            };

            return values;
        }

        if (sso.__typename === 'OIDCConfiguration') {
            values.oidc = {
                clientId: sso.clientId,
                clientSecret: '',
                enforced: sso.enforced,
                endpoint: sso.endpoint,
            };
        }

        return values;
    }, [sso]);

export default useDefaultValues;
