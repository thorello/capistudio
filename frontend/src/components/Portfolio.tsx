import "./Portfolio.css";

const projects = [
  {
    title: "Neon Drift",
    category: "Jogo Arcade",
    description:
      "Corrida futurista com física arcade e trilha synthwave, desenvolvida para web e mobile.",
    gradient: "linear-gradient(135deg, #c026d3, #6366f1)",
  },
  {
    title: "TaskFlow",
    category: "SaaS",
    description:
      "Plataforma de gestão de projetos com colaboração em tempo real e integrações nativas.",
    gradient: "linear-gradient(135deg, #6366f1, #06b6d4)",
  },
  {
    title: "Capy Quest",
    category: "Jogo Casual",
    description:
      "Aventura puzzle com a mascote da Capi Studio, explorando mundos coloridos e desafios criativos.",
    gradient: "linear-gradient(135deg, #a21caf, #2563eb)",
  },
];

export function Portfolio() {
  return (
    <section id="portfolio" className="section portfolio">
      <div className="container">
        <h2 className="section-title">Portfólio</h2>
        <p className="section-subtitle">
          Projetos que demonstram nossa paixão por criar experiências digitais
          únicas.
        </p>
        <div className="grid-3">
          {projects.map((project) => (
            <article key={project.title} className="card portfolio-card">
              <div
                className="portfolio-thumb"
                style={{ background: project.gradient }}
                aria-hidden="true"
              />
              <span className="portfolio-category">{project.category}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
