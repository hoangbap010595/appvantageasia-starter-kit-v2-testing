import { useGetSsoQuery } from './UpdateSSO.api';
import Loader from '@/components/common/Loader';
import SSOForm from '@/pages/SystemManagementPage/SSOSettings/SSOForm';

const SSOSettings = () => {
    const { refetch, data, loading } = useGetSsoQuery();

    if (!data && loading) {
        // this is the first time it is being called
        return <Loader />;
    }

    return <SSOForm refetch={refetch} initialSSO={data?.ssoConfiguration || null} />;
};

export default SSOSettings;
