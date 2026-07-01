import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getContactSubmissions, type ContactSubmission } from "../../lib/api";
import "./SubmissionsPage.css";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function SubmissionCard({ item }: { item: ContactSubmission }) {
  const [expanded, setExpanded] = useState(false);
  const long = item.message.length > 200;

  return (
    <article className="submission-card card">
      <header className="submission-card-header">
        <div className="submission-card-meta">
          <span className="submission-name">{item.name}</span>
          <a
            href={`mailto:${item.email}`}
            className="submission-email"
            target="_blank"
            rel="noreferrer"
          >
            {item.email}
          </a>
        </div>
        <time className="submission-date" dateTime={item.created_at}>
          {formatDate(item.created_at)}
        </time>
      </header>

      <p className={`submission-message${expanded || !long ? "" : " submission-message--truncated"}`}>
        {item.message}
      </p>

      {long && (
        <button
          type="button"
          className="submission-expand"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Ver menos" : "Ver mais"}
        </button>
      )}
    </article>
  );
}

export function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getContactSubmissions()
      .then(setSubmissions)
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar mensagens."))
      .finally(() => setLoading(false));
  }, []);

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
