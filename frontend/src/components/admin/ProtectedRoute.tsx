import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="admin-loading">
        <p>Verificando sessão…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" state={{ from: location.pathname }} replace />;
  }

  return children;
}
