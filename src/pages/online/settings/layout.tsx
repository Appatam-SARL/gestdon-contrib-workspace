import SettingsNav from '@/components/online/settings/SettingsNav';
import { withDashboard } from '@/hoc/withDashboard';
import { Outlet } from 'react-router';

const SettingsLayout = withDashboard(() => {
  return (
    <div className='container mx-auto py-8 flex'>
      {/* Left Navigation */}
      <div className='w-1/4 pr-8'>
        <SettingsNav />
      </div>

      {/* Right Content Area */}
      <div className='w-3/4'>
        <Outlet />
      </div>
    </div>
  );
});

export default SettingsLayout;
