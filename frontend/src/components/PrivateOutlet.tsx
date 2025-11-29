import { Outlet } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from './AppLayout';

export function PrivateOutlet() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </ProtectedRoute>
  );
}
