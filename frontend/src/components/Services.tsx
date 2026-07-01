import "./Services.css";

const services = [
  {
    icon: "🎮",
    title: "Desenvolvimento de Jogos",
    description:
      "Prototipagem rápida, mecânicas envolventes e polimento visual para jogos indie e experiências interativas.",
  },
  {
    icon: "⚙️",
    title: "Software Sob Medida",
    description:
      "Aplicações web e mobile construídas com arquitetura escalável, do MVP ao produto em produção.",
  },
  {
    icon: "🧭",
    title: "Consultoria Técnica",
    description:
      "Revisão de arquitetura, performance e boas práticas para equipes que querem acelerar com segurança.",
  },
];

export function Services() {
  return (
    <section id="servicos" className="section services">
      <div className="container">
        <h2 className="section-title">Serviços</h2>
        <p className="section-subtitle">
          Soluções completas para transformar sua visão em produto digital de
          alta qualidade.
        </p>
        <div className="grid-3">
          {services.map((service) => (
            <article key={service.title} className="card service-card">
              <span className="service-icon" aria-hidden="true">
                {service.icon}
              </span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
