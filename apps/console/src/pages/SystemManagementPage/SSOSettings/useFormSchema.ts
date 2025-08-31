import { zodResolver } from '@hookform/resolvers/zod';
import type { TFunction } from 'i18next';
import { useMemo } from 'react';
import { z } from 'zod';

const createSchema = (t: TFunction) => {
    const requiredError = t('common:formErrors.required');

    return z
        .object({
            msal: z
                .object({
                    authority: z.string({ error: requiredError }),
                    clientId: z.string({ error: requiredError }),
                    clientSecret: z.string(),
                    enforced: z.boolean({ error: requiredError }),
                })
                .nullish(),
            oidc: z
                .object({
                    endpoint: z.string({ error: requiredError }),
                    clientId: z.string({ error: requiredError }),
                    clientSecret: z.string(),
                    enforced: z.boolean({ error: requiredError }),
                })
                .nullish(),
        })
        .required();
};

const useFormSchema = (t: TFunction) => useMemo(() => zodResolver(createSchema(t)), [t]);

export default useFormSchema;

// Example:
// Because we use a function to create the schema outside the hook itself
// We can extract the return type of this function which is the zod schema object itself
// From there, we can infer the validated type of the schema
export type InputValues = z.input<ReturnType<typeof createSchema>>;

export type OutputValues = z.output<ReturnType<typeof createSchema>>;
