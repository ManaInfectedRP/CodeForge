import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-slate-800 py-8 text-sm text-slate-500">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 sm:flex-row sm:justify-between">
        <p>Kodstigen, byggt med Node.js, Express, React och PostgreSQL.</p>
        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Link to="/dashboard" className="hover:text-white">
            Dashboard
          </Link>
          <a
            href="https://sebbe-portfolio.onrender.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white"
          >
            About
          </a>
          <a href="mailto:Sebbelarsson9601@gmail.com" className="hover:text-white">
            Contact us
          </a>
          <a
            href="https://www.linkedin.com/in/sebastian-larsson-b45803246/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white"
          >
            LinkedIn
          </a>
        </nav>
      </div>
    </footer>
  );
}
