import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AfiliadoTurnosPage from './pages/AfiliadoTurnosPage';
import AfiliadoHistorialPage from './pages/AfiliadoHistorialPage';
import PerfilPage from './pages/PerfilPage';
import EmpleadoTurnosPage from './pages/EmpleadoTurnosPage';
import StockPage from './pages/StockPage';
import UsuariosPage from './pages/UsuariosPage';
import ConfiguracionPage from './pages/ConfiguracionPage';
import ReportesPage from './pages/ReportesPage';
import { PrivateOutlet } from './components/PrivateOutlet';
import { RoleGuard } from './components/RoleGuard';
import { AccessDenied } from './components/AccessDenied';
import { useAuthContext } from './state/AuthContext';

function LandingRedirect() {
  const { user } = useAuthContext();
  if (!user) return <Navigate to="/login" replace />;
  const defaultRoute = user.role === 'AFILIADO' ? '/turnos' : '/panel-turnos';
  return <Navigate to={defaultRoute} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/recuperar" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route element={<PrivateOutlet />}>
        <Route index element={<LandingRedirect />} />
        <Route
          path="turnos"
          element={
            <RoleGuard roles={['AFILIADO']} fallback={<AccessDenied />}>
              <AfiliadoTurnosPage />
            </RoleGuard>
          }
        />
        <Route
          path="historial"
          element={
            <RoleGuard roles={['AFILIADO']} fallback={<AccessDenied />}>
              <AfiliadoHistorialPage />
            </RoleGuard>
          }
        />
        <Route path="perfil" element={<PerfilPage />} />
        <Route
          path="panel-turnos"
          element={
            <RoleGuard roles={['EMPLEADO', 'ADMIN']} fallback={<AccessDenied />}>
              <EmpleadoTurnosPage />
            </RoleGuard>
          }
        />
        <Route
          path="stock"
          element={
            <RoleGuard roles={['EMPLEADO', 'ADMIN']} fallback={<AccessDenied />}>
              <StockPage />
            </RoleGuard>
          }
        />
        <Route
          path="usuarios"
          element={
            <RoleGuard roles={['ADMIN']} fallback={<AccessDenied />}>
              <UsuariosPage />
            </RoleGuard>
          }
        />
        <Route
          path="configuracion"
          element={
            <RoleGuard roles={['ADMIN']} fallback={<AccessDenied />}>
              <ConfiguracionPage />
            </RoleGuard>
          }
        />
        <Route
          path="reportes"
          element={
            <RoleGuard roles={['ADMIN']} fallback={<AccessDenied />}>
              <ReportesPage />
            </RoleGuard>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
