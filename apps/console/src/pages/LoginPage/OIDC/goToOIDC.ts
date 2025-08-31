import type { ApolloClient } from '@apollo/client';
import type { OidcUrlQuery } from '../api/sso.api';
import { OidcUrlDocument } from '../api/sso.api';
import assignNewLocation from '@/utils/assignNewLocation';

const goToOIDC = async (apolloClient: ApolloClient<any>) => {
    const { data } = await apolloClient.query<OidcUrlQuery>({
        query: OidcUrlDocument,
        fetchPolicy: 'no-cache',
    });

    if (data.url) {
        assignNewLocation(data.url);
    }
};

export default goToOIDC;
