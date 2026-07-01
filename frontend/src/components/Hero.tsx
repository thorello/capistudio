import "./Hero.css";

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg" aria-hidden="true" />
      <div className="container hero-content">
        <img
          src="/logo.svg"
          alt="Capi Studio"
          className="hero-logo"
          width={280}
          height={336}
        />
        <h1 className="hero-title">
          Criamos jogos e software com{" "}
          <span className="hero-highlight">propósito</span>
        </h1>
        <p className="hero-subtitle">
          A Capi Studio transforma ideias em experiências digitais memoráveis —
          do conceito ao lançamento, com engenharia de ponta e design que
          conecta.
        </p>
        <div className="hero-actions">
          <a href="#contato" className="btn btn-primary">
            Fale conosco
          </a>
          <a href="#portfolio" className="btn btn-secondary">
            Ver portfólio
          </a>
        </div>
      </div>
    </section>
  );
}
