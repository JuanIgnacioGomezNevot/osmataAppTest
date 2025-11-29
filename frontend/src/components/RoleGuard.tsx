import { ReactNode } from 'react';
import { useAuthContext } from '../state/AuthContext';

type Role = 'AFILIADO' | 'EMPLEADO' | 'ADMIN';

type Props = {
  roles: Role[];
  fallback?: ReactNode;
  children: ReactNode;
};

export function RoleGuard({ roles, fallback = null, children }: Props) {
  const { user } = useAuthContext();
  if (!user) return null;
  if (!roles.includes(user.role)) return <>{fallback}</>;
  return <>{children}</>;
}
