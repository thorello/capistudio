import { useState, type FormEvent } from "react";
import { submitContact } from "../lib/contactApi";
import "./Contact.css";

const CONTACT_EMAIL = "morello@capistudio.com";

export function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await submitContact({ name, email, message });
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Erro ao enviar mensagem"
      );
    }
  }

  return (
    <section id="contato" className="section contact">
      <div className="container">
        <h2 className="section-title">Contato</h2>
        <p className="section-subtitle">
          Tem um projeto em mente? Envie uma mensagem ou fale diretamente
          conosco.
        </p>

        <div className="contact-grid">
          <div className="contact-info card">
            <h3>Vamos conversar</h3>
            <p>
              Estamos prontos para ouvir sua ideia e ajudar a transformá-la em
              realidade.
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="contact-email">
              {CONTACT_EMAIL}
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="btn btn-secondary contact-mailto"
            >
              Enviar e-mail direto
            </a>
          </div>

          <form className="contact-form card" onSubmit={handleSubmit}>
            <label>
              Nome
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={120}
                placeholder="Seu nome"
              />
            </label>
            <label>
              E-mail
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
                placeholder="seu@email.com"
              />
            </label>
            <label>
              Mensagem
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                maxLength={2000}
                rows={5}
                placeholder="Conte sobre seu projeto..."
              />
            </label>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Enviando..." : "Enviar mensagem"}
            </button>
            {status === "success" && (
              <p className="contact-feedback success">
                Mensagem enviada com sucesso! Responderemos em breve.
              </p>
            )}
            {status === "error" && (
              <p className="contact-feedback error">
                {errorMessage}. Você também pode enviar um e-mail para{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
