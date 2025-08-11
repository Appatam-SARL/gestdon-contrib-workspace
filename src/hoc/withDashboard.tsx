import HelpButton from '@/components/commons/HelpButton';
import SupportButton from '@/components/commons/SupportButton';
import { useFindByToken, useLogout } from '@/hook/admin.hook';
import React from 'react';

// import { NotificationButton } from '@/components/commons/NotificationButton';
import NotificationButton from '@/components/commons/NotificationButton';
import ProfilButton from '@/components/commons/ProfilButton';
import { useGetMenus } from '@/hook/menu.hook';
import { useGetPermissionByAdminId } from '@/hook/permission.hook';
import { IPermission } from '@/interface/permission';
import useContributorStore from '@/store/contributor.store';
import { usePermissionStore } from '@/store/permission.store';
import useUserStore from '@/store/user.store';
import { IUser } from '@/types/user';
import Aside from './aside';

export function withDashboard<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithDashboardComponent(props: P) {
    const user = useUserStore((s) => s.user);
    const contributorId = useContributorStore((s) => s.contributor?._id);
    const setPermissionStore = usePermissionStore((s) => s.setPermissionStore);

    const mutation = useLogout();

    useFindByToken();

    const { data: permission, isSuccess } = useGetPermissionByAdminId(
      user?._id ?? ''
    );
    const { data: menus } = useGetMenus({
      contributorId: contributorId as string,
    });
    console.log('🚀 ~ WithDashboardComponent ~ menus:', menus);

    React.useEffect(() => {
      if (isSuccess && permission?.data) {
        setPermissionStore(
          'permissionMemberLogged',
          permission.data as IPermission[]
        );
      }
    }, [isSuccess, permission, setPermissionStore]);

    return (
      <div className='min-h-screen bg-background flex'>
        {/* Sidebar */}
        <Aside menus={menus?.data as any} />
        {/* Main Content */}
        <main className='flex-1 p-8'>
          <div className='flex justify-end items-center mb-4 gap-2'>
            <HelpButton />
            <NotificationButton />
            <SupportButton />
            <ProfilButton mutation={mutation} user={user as Partial<IUser>} />
          </div>
          <WrappedComponent {...props} />
        </main>
      </div>
    );
  };
}
