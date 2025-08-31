import type { ApolloClient } from '@apollo/client';
import type { MsalUrlQuery } from '../api/sso.api';
import { MsalUrlDocument } from '../api/sso.api';
import assignNewLocation from '@/utils/assignNewLocation';

const goToMSAL = async (apolloClient: ApolloClient<any>) => {
    const { data } = await apolloClient.query<MsalUrlQuery>({
        query: MsalUrlDocument,
        fetchPolicy: 'no-cache',
    });

    if (data.url) {
        assignNewLocation(data.url);
    }
};

export default goToMSAL;
