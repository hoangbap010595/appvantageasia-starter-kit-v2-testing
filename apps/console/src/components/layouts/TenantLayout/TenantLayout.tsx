import StackedLayout from '../StackedLayout';
import TenantNavBar from '@/components/blocks/TenantNavBar';
import TenantSideBar from '@/components/blocks/TenantSideBar';
import TenantContextProvider from '@/contexts/TenantContext';

const TenantLayout = () => (
    <TenantContextProvider>
        <StackedLayout sidebar={<TenantSideBar />} navbar={<TenantNavBar />} />
    </TenantContextProvider>
);

export default TenantLayout;
