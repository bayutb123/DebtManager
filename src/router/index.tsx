import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import PrimaryLayout from '../layout/PrimaryLayout';
import LoginPage from '../features/auth/pages/LoginPage';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import DebtsPage from '../features/debts/pages/DebtsPage';
import DebtDetailPage from '../features/debts/pages/DebtDetailPage';
import ReceivablesPage from '../features/receivables/pages/ReceivablesPage';
import ReceivableDetailPage from '../features/receivables/pages/ReceivableDetailPage';
import ContactsPage from '../features/contacts/pages/ContactsPage';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<PrimaryLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/debts" element={<DebtsPage />} />
        <Route path="/debts/:id" element={<DebtDetailPage />} />
        <Route path="/receivables" element={<ReceivablesPage />} />
        <Route path="/receivables/:id" element={<ReceivableDetailPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default AppRoutes;
