import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LayoutMinimal from '@/components/layout/LayoutMinimal';
import { ErrorBoundary } from '@/pages/auth/ErrorBoundary';
import { Welcome } from '@/pages/auth/Welcome';
import AccountValidation from '@/pages/auth/account-validation';
import ConfirmDon from '@/pages/auth/confirm-don';
import ForgotPassword from '@/pages/auth/forgot-password';
import MFA from '@/pages/auth/mfa';
import RapportActivityOrAudience from '@/pages/auth/rapport-activity-or-audience';
import RegisterInvited from '@/pages/auth/register-user-by-invitation';
import ResetPassword from '@/pages/auth/reset-password';
import HomePage from '@/pages/home/HomePage';
import ActivityPage from '@/pages/online/activity';
import AddActivity from '@/pages/online/activity/AddActivity';
import EditActivity from '@/pages/online/activity/EditActivity';
import ActivityDetailsPage from '@/pages/online/activity/[id]';
import AgendaPage from '@/pages/online/agenda';
import AudiencePage from '@/pages/online/audience';
import { AudienceDetailsPage } from '@/pages/online/audience/[id]';
import { EditAudiencePage } from '@/pages/online/audience/edit';
import AddAudiencePage from '@/pages/online/audience/form-add';
import CommunityPage from '@/pages/online/community';
import DetailCommunity from '@/pages/online/community/[id]';
import AddDonForm from '@/pages/online/community/form-add';

import Conversation from '@/pages/auth/conversation';
import Register from '@/pages/auth/register';
import RegisterSuccessfull from '@/pages/auth/register-successfull';
import { DonPage } from '@/pages/online/don';
import { PromisesPage } from '@/pages/online/promise';
import RepportsPage from '@/pages/online/rapports';
import ReportDetailsPage from '@/pages/online/rapports/[id]';
import Settings from '@/pages/online/settings';
import SettingsLayout from '@/pages/online/settings/layout';
import SettingActivity from '@/pages/online/settings/setting-activity';
import SettingBeneficiary from '@/pages/online/settings/setting-beneficiary';
import SettingsActivityCustomizableForm from '@/pages/online/settings/settings-activity-customizable-form';
import SettingsBeneficiaryCustomizableForm from '@/pages/online/settings/settings-beneficiary-customizable-form';
import { StaffPage } from '@/pages/online/staff';
import { StaffDetailsPage } from '@/pages/online/staff/[id]';
import AddStaffForm from '@/pages/online/staff/form-add';
import ChoixPlan from '@/pages/welcome/contributeur/ChoixPlan';
import OrganisationForm from '@/pages/welcome/contributeur/OrganisationForm';
import PaiementPage from '@/pages/welcome/contributeur/PaiementPage';
import PaiementSuccessPage from '@/pages/welcome/contributeur/PaiementSuccessPage';
import React from 'react';

const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));
const Dashboard = React.lazy(() => import('@/pages/online/dashboard'));
const NotFoundPage = React.lazy(() => import('@/pages/auth/ErrorNotFound'));

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
        <Route path='/confirm-don' element={<ConfirmDon />} />
        <Route path='/report-offline' element={<RapportActivityOrAudience />} />
        <Route path='/conversation/:id' element={<Conversation />} />
        <Route path='/register' element={<Register />} />
        <Route path='/register-successfull' element={<RegisterSuccessfull />} />

        <Route
          path='/'
          element={
            <React.Suspense fallback={<Welcome />}>
              <ErrorBoundary>
                <LayoutMinimal>
                  <LoginPage />
                </LayoutMinimal>
              </ErrorBoundary>
            </React.Suspense>
          }
        />
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

        <Route path='/'>
          <Route
            path='/dashboard'
            element={
              <React.Suspense fallback={<Welcome />}>
                <ErrorBoundary>
                  <Dashboard />
                </ErrorBoundary>
              </React.Suspense>
            }
          />
          <Route path='audiences'>
            <Route index element={<AudiencePage />} />
            <Route path='create' element={<AddAudiencePage />} />
            <Route path=':id' element={<AudienceDetailsPage />} />
            <Route path=':id/edit' element={<EditAudiencePage />} />
          </Route>
          <Route path='/don'>
            <Route index element={<DonPage />} />
            <Route path=':id' element={<HomePage />} />
            <Route path=':id/edit' element={<HomePage />} />
            <Route path='create' element={<HomePage />} />
          </Route>
          <Route path='/activity'>
            <Route index element={<ActivityPage />} />
            <Route path='create' element={<AddActivity />} />
            <Route path=':id' element={<ActivityDetailsPage />} />
            <Route path=':id/edit' element={<EditActivity />} />
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
            <Route path=':id' element={<ReportDetailsPage />} />
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

        <Route
          path='*'
          element={
            <React.Suspense fallback={<Welcome />}>
              <ErrorBoundary>
                <LayoutMinimal>
                  <NotFoundPage />
                </LayoutMinimal>
              </ErrorBoundary>
            </React.Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
