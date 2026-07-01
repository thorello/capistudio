import "./Footer.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <img src="/logo.svg" alt="" width={36} height={43} aria-hidden="true" />
          <span>Capi Studio</span>
        </div>
        <p className="footer-copy">
          &copy; {year} Capi Studio. Todos os direitos reservados.
        </p>
        <a href="mailto:morello@capistudio.com" className="footer-email">
          morello@capistudio.com
        </a>
      </div>
    </footer>
  );
}
