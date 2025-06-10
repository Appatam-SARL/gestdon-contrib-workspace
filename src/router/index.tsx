import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ProtectedLayout from '@/ProtectedRoute';
import LayoutMinimal from '@/components/layout/LayoutMinimal';
import EmailVerificationPage from '@/pages/auth/EmailVerificationPage';
import LoginPage from '@/pages/auth/LoginPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import AccountValidation from '@/pages/auth/account-validation';
import ForgotPassword from '@/pages/auth/forgot-password';
import MFA from '@/pages/auth/mfa';
import RegisterInvited from '@/pages/auth/register-user-by-invitation';
import ResetPassword from '@/pages/auth/reset-password';
import HomePage from '@/pages/home/HomePage';
import AgendaPage from '@/pages/online/agenda';
import AudiencePage from '@/pages/online/audience';
import CommunityPage from '@/pages/online/community';
import DetailCommunity from '@/pages/online/community/[id]';
import AddDonForm from '@/pages/online/community/form-add';
import Dashboard from '@/pages/online/dashboard';
import { DonPage } from '@/pages/online/don';
import { PromisesPage } from '@/pages/online/promise';
import RepportsPage from '@/pages/online/rapports';
import Settings from '@/pages/online/settings';
import SettingsLayout from '@/pages/online/settings/layout';
import SettingActivity from '@/pages/online/settings/setting-activity';
import SettingBeneficiary from '@/pages/online/settings/setting-beneficiary';
import SettingsActivityCustomizableForm from '@/pages/online/settings/settings-activity-customizable-form';
import SettingsBeneficiaryCustomizableForm from '@/pages/online/settings/settings-beneficiary-customizable-form';
import { StaffPage } from '@/pages/online/staff';
import { StaffDetailsPage } from '@/pages/online/staff/[id]';
import AddStaffForm from '@/pages/online/staff/form-add';
import Welcome from '@/pages/welcome/Welcome';
import ChoixPlan from '@/pages/welcome/contributeur/ChoixPlan';
import OrganisationForm from '@/pages/welcome/contributeur/OrganisationForm';
import PaiementPage from '@/pages/welcome/contributeur/PaiementPage';
import PaiementSuccessPage from '@/pages/welcome/contributeur/PaiementSuccessPage';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* auth */}
        <Route path='/mfa' element={<MFA />} />
        <Route path='/account-validation' element={<AccountValidation />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path='/register-invited' element={<RegisterInvited />} />

        <Route
          path='/'
          element={
            <LayoutMinimal>
              <LoginPage />
            </LayoutMinimal>
          }
        />
        <Route
          path='/sign-up'
          element={
            <LayoutMinimal>
              <SignUpPage />
            </LayoutMinimal>
          }
        />
        {/* <Route
          path='/forgot-password'
          element={
            <LayoutMinimal>
              <ForgotPasswordPage />
            </LayoutMinimal>
          }
        /> */}
        <Route
          path='/verification-email'
          element={
            <LayoutMinimal>
              <EmailVerificationPage />
            </LayoutMinimal>
          }
        />
        {/* <Route
          path='/reset-password'
          element={
            <LayoutMinimal>
              <ResetPasswordPage />
            </LayoutMinimal>
          }
        /> */}
        <Route
          path='/welcome'
          element={
            <LayoutMinimal>
              <Welcome />
            </LayoutMinimal>
          }
        />
        <Route
          path='/organisation-form'
          element={
            <LayoutMinimal>
              <OrganisationForm />
            </LayoutMinimal>
          }
        />
        <Route
          path='/choix-plan'
          element={
            <LayoutMinimal>
              <ChoixPlan />
            </LayoutMinimal>
          }
        />
        <Route
          path='/paiement-page'
          element={
            <LayoutMinimal>
              <PaiementPage />
            </LayoutMinimal>
          }
        />
        <Route
          path='/paiement-success-page'
          element={
            <LayoutMinimal>
              <PaiementSuccessPage />
            </LayoutMinimal>
          }
        />

        <Route path='/' element={<ProtectedLayout />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/don'>
            <Route index element={<DonPage />} />
            <Route path=':id' element={<HomePage />} />
            <Route path=':id/edit' element={<HomePage />} />
            <Route path='create' element={<HomePage />} />
          </Route>
          <Route path='/audiences'>
            <Route index element={<AudiencePage />} />
          </Route>
          <Route path='/promises'>
            <Route index element={<PromisesPage />} />
            <Route path=':id' element={<HomePage />} />
            <Route path=':id/edit' element={<HomePage />} />
            <Route path='create' element={<HomePage />} />
          </Route>
          <Route path='/community'>
            <Route index element={<CommunityPage />} />
            <Route path=':id' element={<DetailCommunity />} />
            <Route path=':id/edit' element={<HomePage />} />
            <Route path='create' element={<AddDonForm />} />
          </Route>
          <Route path='/repport'>
            <Route index element={<RepportsPage />} />
            <Route path=':id' element={<HomePage />} />
            <Route path=':id/edit' element={<HomePage />} />
            <Route path='create' element={<HomePage />} />
          </Route>
          <Route path='/agenda'>
            <Route index element={<AgendaPage />} />
            <Route path=':id' element={<HomePage />} />
            <Route path=':id/edit' element={<HomePage />} />
            <Route path='create' element={<HomePage />} />
          </Route>
          <Route path='/staff'>
            <Route index element={<StaffPage />} />
            <Route path=':id' element={<StaffDetailsPage />} />
            <Route path=':id/edit' element={<StaffPage />} />
            <Route path='create' element={<AddStaffForm />} />
          </Route>
        </Route>
        <Route path='/settings' element={<SettingsLayout />}>
          <Route index element={<Settings />} />
          <Route path='activity' element={<SettingActivity />} />
          <Route path='beneficiary' element={<SettingBeneficiary />} />
          <Route
            path='activity-customizable-form'
            element={<SettingsActivityCustomizableForm />}
          />
          <Route
            path='beneficiary-customizable-form'
            element={<SettingsBeneficiaryCustomizableForm />}
          />
        </Route>
        {/* Add other routes here */}

        {/* <Route path='*' element={<p>Page Not Found</p>} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
