import "./Header.css";

const navItems = [
  { label: "Serviços", href: "#servicos" },
  { label: "Portfólio", href: "#portfolio" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
];

export function Header() {
  return (
    <header className="header">
      <div className="container header-inner">
        <a href="#" className="header-logo">
          <img src="/logo.svg" alt="Capi Studio" width={48} height={58} />
          <span>Capi Studio</span>
        </a>
        <nav className="header-nav">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a href="#contato" className="btn btn-primary header-cta">
          Fale conosco
        </a>
      </div>
    </header>
  );
}
