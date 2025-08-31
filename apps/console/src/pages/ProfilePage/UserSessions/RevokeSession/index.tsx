import { useApolloClient } from '@apollo/client';
import { XCircleIcon } from '@heroicons/react/24/outline';
import { useCallback } from 'react';
import type { RevokeSessionMutation, RevokeSessionMutationVariables } from './RevokeSession.api';
import { RevokeSessionDocument } from './RevokeSession.api';
import Button from '@/components/common/Button';

interface RevokeSessionProps {
    refetch: () => unknown;
    record: any;
}

const RevokeSession = ({ refetch, record }: RevokeSessionProps) => {
    const apolloClient = useApolloClient();
    const onEnd = useCallback(async () => {
        const mutation = await apolloClient.mutate<RevokeSessionMutation, RevokeSessionMutationVariables>({
            mutation: RevokeSessionDocument,
            variables: {
                id: record.id,
            },
        });

        if (mutation.data?.revokeSession) {
            refetch();
        }
    }, [apolloClient, record.id, refetch]);

    return (
        <Button plain onClick={onEnd}>
            <XCircleIcon className="h-5 w-5" />
        </Button>
    );
};
export default RevokeSession;
