import { useAuth } from "../../contexts/AuthContext";
import { AdminPage } from "./AdminPage";
import { LoginPage } from "./LoginPage";

export function AdminEntry() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-loading">
        <p>Verificando sessão…</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <AdminPage />;
}
