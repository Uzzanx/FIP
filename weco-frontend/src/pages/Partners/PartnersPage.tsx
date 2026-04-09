import { Link, useNavigate } from 'react-router-dom'
import headerLogo from '../../assets/header-logo.png'
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './PartnersPage.module.css'

export default function PartnersPage() {
  const { locale } = useLanguage()
  const ru = locale === 'ru'
  const navigate = useNavigate()

  const text = {
    home: ru ? 'Главная' : 'Home',
    contact: ru ? 'Контакты' : 'Contact',
    partners: ru ? 'Партнеры' : 'Partners',
    back: ru ? 'Назад' : 'Back',
    title: ru ? 'ПАРТНЕРЫ' : 'PARTNERS',
    impactTitle: ru ? 'Ожидаемые показатели' : 'Expected impact',
    impactItems: ru
      ? [
        'Ожидаем переработку 10 000+ бутылок',
        'Ожидаем сохранить 500+ кг пластика',
        'Ожидаем подключить 5+ партнерских бизнесов',
        'Пилотный запуск в Бишкеке',
      ]
      : [
        'Expected: 10.000+ bottles recycled',
        'Expected: 500+ kg of plastic saved',
        'Expected: 5+ partner businesses',
        'Pilot launch in Bishkek',
      ],
    forPartners: ru ? 'Для партнеров' : 'For partners',
    lead: ru
      ? 'Присоединяйтесь к WEco и подключите ваш бренд к новому поколению осознанных потребителей.'
      : 'Join WEco and connect your brand to a new generation of conscious consumers.',
    gainsTitle: ru ? 'Что получают партнеры:' : 'Partner benefits:',
    gains: ru
      ? ['Новые клиенты через бонусную систему', 'Видимость бренда на эко-боксах', 'Ассоциация с устойчивым развитием', 'Данные и инсайты о поведении пользователей']
      : ['New customers through bonuses', 'Brand visibility on eco-boxes', 'Association with sustainability', 'Data and insights about user behavior'],
    cta: ru ? 'СТАТЬ ПАРТНЕРОМ' : 'BECOME A PARTNER',
  }

  return (
    <div className={styles['page'] + (ru ? ' ' + styles['page--ru'] : '')}>
      <header className={styles['page__header']}>
        <div className={styles['page__logo']}>
          <img src={headerLogo} alt="WEco" className={styles['page__logo-img']} />
        </div>
        <nav className={styles['page__nav']}>
          <Link to="/">{text.home}</Link>
          <Link to="/partners" aria-current="page">{text.partners}</Link>
          <Link to="/contact">{text.contact}</Link>
        </nav>
        <LanguageToggle />
        <button
          type="button"
          className={styles['page__back']}
          onClick={() => navigate(-1)}
          aria-label={text.back}
        >
          &#8592;
        </button>
      </header>

      <main className={styles['page__content']}>
        <section className={styles['page__hero']}>
          <h1 className={styles['page__title']}>{text.title}</h1>
        </section>

        <section className={styles['page__impact']}>
          <h2 className={styles['page__section-title']}>{text.impactTitle}</h2>
          <ul className={styles['page__impact-list']}>
            {text.impactItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles['page__partners']}>
          <div className={styles['page__partners-leaf']}>
            <div className={styles['page__partners-text']}>
              <h2 className={styles['page__section-title--light']}>{text.forPartners}</h2>
              <p className={styles['page__section-text--light']}>{text.lead}</p>
              <p className={styles['page__section-text--light']}>{text.gainsTitle}</p>
              <ul className={styles['page__benefits']}>
                {text.gains.map((gain) => (
                  <li key={gain}>{gain}</li>
                ))}
              </ul>
              <button
                type="button"
                className={styles['page__cta']}
                onClick={() => navigate('/contact')}
              >
                {text.cta}
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles['page__footer']}>
        <a
          className={styles['page__dot'] + ' ' + styles['page__dot-link']}
          href="https://www.instagram.com/weco_kg/"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram WEco KG"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5"/>
            <circle cx="12" cy="12" r="5"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
          </svg>
        </a>
        <span className={styles['page__dot']} />
        <span className={styles['page__dot'] + ' ' + styles['page__dot--active']} />
      </footer>
    </div>
  )
}
