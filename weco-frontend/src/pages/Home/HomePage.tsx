import { useNavigate } from 'react-router-dom'
import headerLogo from '../../assets/header-logo.png'
import WEcoMap from '../../components/Map/WEcoMap'
import styles from './HomePage.module.css'

export default function HomePage() {
  const navigate = useNavigate()
  const isAuth = !!localStorage.getItem('token')

  return (
    <div className={styles['page']}>
      {/* Top header: logo + page links + arrows */}
      <header className={styles['page__header']}>
        <div className={styles['page__logo']}>
          <img src={headerLogo} alt="WEco" className={styles['page__logo-img']} />
        </div>
        <nav className={styles['page__nav']}>
          <a href="#top">Home</a>
          <a href="#" onClick={e => { e.preventDefault(); navigate('/login') }}>Login/Sign in</a>
          <a href="#" onClick={e => { e.preventDefault(); navigate(isAuth ? '/profile' : '/login') }}>Profile</a>
        </nav>
        <div className={styles['page__header-arrows']}>
          <button className={styles['page__arrow']} onClick={() => window.history.back()} aria-label="Back">&#8592;</button>
          <button className={styles['page__arrow']} onClick={() => window.history.forward()} aria-label="Forward">&#8594;</button>
        </div>
      </header>

      {/* Sub-nav: section anchors */}
      <nav className={styles['page__subnav']}>
        <a href="#about">ABOUT US</a>
        <a href="#mission">OUR MISSION</a>
        <a href="#locations">OUR LOCATIONS</a>
        <a href="#bonuses">ABOUT BONUSES</a>
      </nav>

      <section id="top" className={styles['page__hero']}>
        <div className={styles['page__hero-lines']}>
          <span className={styles['page__hero-line']}>GET YOUR BONUS</span>
          <button
            className={styles['page__btn']}
            onClick={() => navigate(isAuth ? '/profile' : '/login')}
          >
            YOUR BONUS
          </button>
          <span className={styles['page__hero-line']}>GET YOUR BONUS</span>
        </div>
      </section>

      <section id="about" className={styles['page__section--about']}>
        <div className={styles['page__about-leaf']}>
          <div className={styles['page__about-text']}>
            <h2 className={styles['page__section-title--light']}>ABOUT US</h2>
            <p className={styles['page__section-text--light']}>
              Every day, thousands of plastic bottles are thrown away in Kyrgyzstan,
              and we decided to change it.
              Our smart boxes, installed in hypermarkets, accept bottles and turn
              them into bonuses and discounts from partners.
            </p>
            <p className={styles['page__section-text--light']}>Let&apos;s make Kyrgyzstan cleaner together.</p>
            <p className={styles['page__section-text--light']}>Join us!</p>
            <p className={styles['page__about-tagline']}>⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Life is clean with WEco&apos;s force</p>
          </div>
          <div className={styles['page__about-logo-wrap']} />
        </div>
      </section>

      <section id="mission" className={styles['page__section']}>
        <h2 className={styles['page__section-title']}>OUR MISSION</h2>
        <p className={styles['page__section-text']}>
          Our mission is to build a culture of responsibility so that ecology becomes
          everyone&apos;s business.
        </p>
        <p className={styles['page__section-text']}>Join us and become part of it!</p>
      </section>

      <section id="bonuses" className={styles['page__section--bonuses']}>
        <div className={styles['page__bonuses-leaf']}>
          <h2 className={styles['page__section-title--light']}>ABOUT BONUSES</h2>
          <p className={styles['page__section-text--light']}>Empty plastic bottles are accepted in WECO eco-boxes installed in partner hypermarkets.</p>
          <p className={styles['page__section-text--light']}>The device scans a QR code, which links the transaction to the user&apos;s individual account.</p>
          <p className={styles['page__section-text--light']}>After accepting the bottles, the system awards bonus points that can be exchanged for discounts and privileges from program partners.</p>
          <p className={styles['page__section-text--light']}>The recycling process becomes a convenient and profitable way to care for the environment.</p>
        </div>
      </section>

      <section id="locations" className={styles['page__section']}>
        <h2 className={styles['page__section-title']}>OUR LOCATIONS</h2>
        <p className={styles['page__locations-sub']}>Places where you can find our boxes</p>
        <WEcoMap />
      </section>

      <footer className={styles['page__footer']}>
        {/* Instagram */}
        <span className={styles['page__dot'] + ' ' + styles['page__dot--icon']}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5"/>
            <circle cx="12" cy="12" r="5"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
          </svg>
        </span>
        {/* TikTok */}
        <span className={styles['page__dot'] + ' ' + styles['page__dot--icon']}>
          <svg width="10" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.79a4.85 4.85 0 01-1.02-.1z"/>
          </svg>
        </span>
        <span className={styles['page__dot']} />
        <span className={styles['page__dot'] + ' ' + styles['page__dot--active']} />
      </footer>
    </div>
  )
}
