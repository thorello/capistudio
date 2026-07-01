import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./AdminPage.css";

const menuItems = [
  { label: "Mensagens de contato", description: "Visualizar formulários recebidos", href: "#" },
  { label: "Portfólio", description: "Gerenciar projetos exibidos no site", href: "#" },
  { label: "Depoimentos", description: "Editar avaliações de clientes", href: "#" },
  { label: "Configurações", description: "Preferências do site", href: "#" },
];

export function AdminPage() {
  const { user, signOut } = useAuth();

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="container admin-header-inner">
          <div className="admin-brand">
            <img src="/logo.svg" alt="Capi Studio" width={32} height={32} />
            <span>Painel Admin</span>
          </div>

          <div className="admin-header-actions">
            <span className="admin-user-email">{user?.email}</span>
            <button type="button" className="btn btn-secondary admin-logout" onClick={() => signOut()}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main container">
        <div className="admin-welcome">
          <h1>Painel administrativo</h1>
          <p>Bem-vindo, {user?.email?.split("@")[0]}.</p>
        </div>

        <nav className="admin-menu grid-2" aria-label="Menu administrativo">
          {menuItems.map((item) => (
            <a key={item.label} href={item.href} className="admin-menu-item card">
              <h2>{item.label}</h2>
              <p>{item.description}</p>
            </a>
          ))}
        </nav>

        <p className="admin-footer-note">
          <Link to="/">← Voltar ao site público</Link>
        </p>
      </main>
    </div>
  );
}
