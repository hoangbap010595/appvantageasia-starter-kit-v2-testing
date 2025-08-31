const lazy = <Args extends any[], Output>(
    loadTaskFunction: () => Promise<(...args: Args) => Promise<Output> | Output>
) => {
    let task: Awaited<ReturnType<typeof loadTaskFunction>> | null = null;

    return async (...args: Args): Promise<Output> => {
        if (!task) {
            task = await loadTaskFunction();
        }

        return task(...args);
    };
};

const tasks = {
    'apv:loadSnapshots': lazy(async () => {
        const m = await import('./loadSnapshots.js');

        return m.default;
    }),

    'apv:getAuthCredentials': lazy(async () => {
        const m = await import('./getAuthCredentials.js');

        return m.default;
    }),

    'apv:getUser': lazy(async () => {
        const m = await import('./getUser.js');

        return m.default;
    }),

    'apv:getEmail': lazy(async () => {
        const m = await import('./emails.js');

        return m.get;
    }),

    'apv:emptyInbox': lazy(async () => {
        const m = await import('./emails.js');

        return m.empty;
    }),

    'apv:getOtpCredentials': lazy(async () => {
        const m = await import('./getOtpCredentials.js');

        return m.default;
    }),

    'apv:getVerifyCodeForOtp': lazy(async () => {
        const m = await import('./getVerifyCodeForOtp.js');

        return m.default;
    }),
};

export default tasks;
