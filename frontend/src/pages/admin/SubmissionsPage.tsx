import { Link } from "react-router-dom";
import { SubmissionCard } from "../../components/admin/SubmissionCard";
import { useSubmissions } from "../../hooks/useSubmissions";
import "./SubmissionsPage.css";

export function SubmissionsPage() {
  const { submissions, loading, error } = useSubmissions();

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="container admin-header-inner">
          <div className="admin-brand">
            <img src="/logo.svg" alt="Capi Studio" width={32} height={32} />
            <span>Painel Admin</span>
          </div>
          <Link to="/admin" className="btn btn-secondary admin-back-btn">
            ← Voltar
          </Link>
        </div>
      </header>

      <main className="admin-main container">
        <div className="admin-welcome">
          <h1>Mensagens de contato</h1>
          {!loading && !error && (
            <p>
              {submissions.length === 0
                ? "Nenhuma mensagem recebida ainda."
                : `${submissions.length} mensagem${submissions.length !== 1 ? "s" : ""} recebida${submissions.length !== 1 ? "s" : ""}.`}
            </p>
          )}
        </div>

        {loading && (
          <div className="submissions-loading">
            <div className="submissions-spinner" aria-hidden="true" />
            <p>Carregando mensagens…</p>
          </div>
        )}

        {error && (
          <div className="submissions-error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && submissions.length === 0 && (
          <div className="submissions-empty">
            <p>Quando alguém preencher o formulário de contato, as mensagens aparecerão aqui.</p>
          </div>
        )}

        {!loading && !error && submissions.length > 0 && (
          <ul className="submissions-list">
            {submissions.map((item) => (
              <li key={item.id}>
                <SubmissionCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
