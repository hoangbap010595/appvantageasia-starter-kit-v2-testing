import StackedLayout from '../StackedLayout';
import SystemNavBar from '@/components/blocks/SystemNavBar';
import SystemSideBar from '@/components/blocks/SystemSideBar';

const SystemLayout = () => <StackedLayout sidebar={<SystemSideBar />} navbar={<SystemNavBar />} />;

export default SystemLayout;
