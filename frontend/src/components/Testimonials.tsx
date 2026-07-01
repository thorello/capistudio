import "./Testimonials.css";

const testimonials = [
  {
    quote:
      "A Capi Studio entregou nosso jogo com qualidade excepcional. A atenção aos detalhes e a comunicação foram impecáveis do início ao fim.",
    name: "Ana Ribeiro",
    role: "Fundadora, Pixel Dreams",
  },
  {
    quote:
      "Precisávamos de um MVP robusto em poucas semanas. A equipe superou expectativas com arquitetura sólida e código limpo.",
    name: "Carlos Mendes",
    role: "CTO, StartupLab",
  },
  {
    quote:
      "A consultoria técnica da Capi nos ajudou a reestruturar nosso backend e reduzir custos de infraestrutura em 40%.",
    name: "Mariana Costa",
    role: "Head de Engenharia, CloudNine",
  },
];

export function Testimonials() {
  return (
    <section id="depoimentos" className="section testimonials">
      <div className="container">
        <h2 className="section-title">Depoimentos</h2>
        <p className="section-subtitle">
          O que nossos parceiros dizem sobre trabalhar com a Capi Studio.
        </p>
        <div className="grid-3">
          {testimonials.map((item) => (
            <blockquote key={item.name} className="card testimonial-card">
              <p className="testimonial-quote">&ldquo;{item.quote}&rdquo;</p>
              <footer>
                <strong>{item.name}</strong>
                <span>{item.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
