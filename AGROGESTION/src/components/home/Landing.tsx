/**
 * @file Landing.tsx
 * @description Landing page completa de Agrogestión.
 *
 * Estructura:
 *   - Header: logo a la izquierda, login/registro/idioma a la derecha
 *   - Hero: imagen de fondo con CTA
 *   - Features: tarjetas con funcionalidades principales
 *   - Cómo funciona: pasos del flujo
 *   - Footer: políticas, contacto, copyright e iconos sociales
 */

import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../common/LanguageSwitcher';

/* ── Iconos SVG inline para redes sociales ── */
const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

/**
 * Landing page principal de Agrogestión.
 * Renderiza header, hero, features, cómo funciona y footer.
 */
export default function Landing() {
  const { t } = useTranslation();

  return (
    <div className="landing">
      {/* ════════════════════ HEADER ════════════════════ */}
      <header className="landing-header">
        <div className="landing-header__inner">
          {/* Logo + nombre */}
          <Link to="/" className="landing-header__brand">
            <img
              src="/LogoAgrogestion.png"
              alt="Agrogestión"
              className="landing-header__logo"
            />
            <span className="landing-header__title">{t('app.name')}</span>
          </Link>

          {/* Acciones */}
          <nav className="landing-header__nav">
            <Link to="/login" className="btn-primary">{t('auth.login')}</Link>
            <Link to="/registro" className="btn-secondary">{t('auth.register')}</Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

      {/* ════════════════════ HERO ════════════════════ */}
      <section className="landing-hero">
        <img
          src="/LogoAgrogestion.png"
          alt="Agrogestión logo"
          className="landing-hero__logo"
        />
        <h1 className="landing-hero__title">{t('app.name')}</h1>
        <p className="landing-hero__slogan">{t('app.slogan')}</p>
        <p className="landing-hero__desc">{t('landing.heroDesc')}</p>
        <div className="landing-hero__cta">
          <Link to="/registro" className="btn-primary">{t('landing.startFree')}</Link>
          <a href="#features" className="btn-secondary">{t('landing.discoverMore')}</a>
        </div>
      </section>

      {/* ════════════════════ FEATURES ════════════════════ */}
      <section id="features" className="landing-features">
        <h2 className="landing-section-title">{t('landing.featuresTitle')}</h2>
        <div className="landing-features__grid">
          <div className="landing-feature-card">
            <div className="landing-feature-card__icon">🌾</div>
            <h3>{t('landing.featureLands')}</h3>
            <p>{t('landing.featureLandsDesc')}</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-card__icon">📋</div>
            <h3>{t('landing.featureTasks')}</h3>
            <p>{t('landing.featureTasksDesc')}</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-card__icon">👥</div>
            <h3>{t('landing.featureTeam')}</h3>
            <p>{t('landing.featureTeamDesc')}</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-card__icon">📊</div>
            <h3>{t('landing.featureReports')}</h3>
            <p>{t('landing.featureReportsDesc')}</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-card__icon">🔒</div>
            <h3>{t('landing.featureSecurity')}</h3>
            <p>{t('landing.featureSecurityDesc')}</p>
          </div>
          <div className="landing-feature-card">
            <div className="landing-feature-card__icon">🌍</div>
            <h3>{t('landing.featureLanguages')}</h3>
            <p>{t('landing.featureLanguagesDesc')}</p>
          </div>
        </div>
      </section>

      {/* ════════════════════ CÓMO FUNCIONA ════════════════════ */}
      <section className="landing-steps">
        <h2 className="landing-section-title">{t('landing.howTitle')}</h2>
        <div className="landing-steps__grid">
          <div className="landing-step">
            <div className="landing-step__number">1</div>
            <h3>{t('landing.step1Title')}</h3>
            <p>{t('landing.step1Desc')}</p>
          </div>
          <div className="landing-step">
            <div className="landing-step__number">2</div>
            <h3>{t('landing.step2Title')}</h3>
            <p>{t('landing.step2Desc')}</p>
          </div>
          <div className="landing-step">
            <div className="landing-step__number">3</div>
            <h3>{t('landing.step3Title')}</h3>
            <p>{t('landing.step3Desc')}</p>
          </div>
          <div className="landing-step">
            <div className="landing-step__number">4</div>
            <h3>{t('landing.step4Title')}</h3>
            <p>{t('landing.step4Desc')}</p>
          </div>
        </div>
      </section>

      {/* ════════════════════ FOOTER ════════════════════ */}
      <footer className="landing-footer">
        <div className="landing-footer__inner">
          {/* Columna 1: Marca */}
          <div className="landing-footer__col">
            <div className="landing-footer__brand">
              <img src="/LogoAgrogestion.png" alt="Agrogestión" className="landing-footer__logo" />
              <span className="landing-footer__name">{t('app.name')}</span>
            </div>
            <p className="landing-footer__tagline">{t('app.slogan')}</p>
          </div>

          {/* Columna 2: Enlaces legales */}
          <div className="landing-footer__col">
            <h4>{t('landing.legal')}</h4>
            <ul>
              <li><a href="#privacidad">{t('landing.privacy')}</a></li>
              <li><a href="#terminos">{t('landing.terms')}</a></li>
              <li><a href="#cookies">{t('landing.cookies')}</a></li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div className="landing-footer__col">
            <h4>{t('landing.contact')}</h4>
            <ul>
              <li>
                <span className="landing-footer__icon">✉</span>
                <a href="mailto:admin@agrogestion.com">admin@agrogestion.com</a>
              </li>
              <li>
                <span className="landing-footer__icon">☎</span>
                <a href="tel:+34600123456">+34 600 123 456</a>
              </li>
            </ul>
          </div>

          {/* Columna 4: Redes sociales */}
          <div className="landing-footer__col">
            <h4>{t('landing.followUs')}</h4>
            <div className="landing-footer__socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FacebookIcon />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://github.com/Juanfrina/Agrogestion.Web" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <GitHubIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="landing-footer__bottom">
          <p>&copy; {new Date().getFullYear()} {t('landing.copyright')}</p>
        </div>
      </footer>
    </div>
  );
}
