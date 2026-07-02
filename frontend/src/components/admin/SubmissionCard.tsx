import { useState } from "react";
import type { ContactSubmission } from "../../domain/ContactSubmission";

type SubmissionCardProps = {
  item: ContactSubmission;
};

export function SubmissionCard({ item }: SubmissionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const long = item.isLongMessage;

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
        <time className="submission-date" dateTime={item.createdAtIso}>
          {item.formatCreatedAt()}
        </time>
      </header>

      <p className={`submission-message${expanded || !long ? "" : " submission-message--truncated"}`}>
        {item.message}
      </p>

      {long && (
        <button
          type="button"
          className="submission-expand"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? "Ver menos" : "Ver mais"}
        </button>
      )}
    </article>
  );
}
