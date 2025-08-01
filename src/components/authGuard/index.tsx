import type {ReactNode} from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthGuard = ({
  children,
  requireAuth = true,
  redirectTo = '/login'
}: AuthGuardProps) => {
  const location = useLocation();

  // TODO: Thay thế bằng logic kiểm tra authentication thực tế
  const wasLogin = false;

  if (requireAuth && !wasLogin) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!requireAuth && wasLogin) {
    return <Navigate to="/homepage" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
