import { Link, useNavigate } from 'react-router-dom'
import headerLogo from '../../assets/header-logo.png'
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './ContactPage.module.css'

export default function ContactPage() {
  const { locale } = useLanguage()
  const ru = locale === 'ru'
  const navigate = useNavigate()

  const text = {
    title: ru ? 'КОНТАКТЫ' : 'CONTACTS',
    home: ru ? 'Главная' : 'Home',
    profile: ru ? 'Профиль' : 'Profile',
    partners: ru ? 'Партнеры' : 'Partners',
    contact: ru ? 'Контакты' : 'Contact',
    back: ru ? 'Назад' : 'Back',
    email: ru ? 'Почта' : 'Email',
    location: ru ? 'Локация' : 'Location',
    instagram: 'Instagram',
    locationValue: ru ? 'Бишкек, Кыргызстан' : 'Bishkek, Kyrgyzstan',
    locationLinkText: ru ? 'Колледж AUCA, Бишкек' : 'AUCA College, Bishkek',
    writeUs: ru ? 'Напишите нам' : 'Write to us',
    findUs: ru ? 'Где мы находимся' : 'Where to find us',
    followUs: ru ? 'Подписывайтесь на нас' : 'Follow us',
  }

  const aucaMapsUrl = 'https://www.google.com/maps/place/%D0%98%D0%BD%D0%BD%D0%BE%D0%B2%D0%B0%D1%86%D0%B8%D0%BE%D0%BD%D0%BD%D1%8B%D0%B9+%D0%BA%D0%BE%D0%BB%D0%BB%D0%B5%D0%B4%D0%B6+%D0%90%D0%A3%D0%A6%D0%90/@42.852745,74.6045875,645m/data=!3m2!1e3!4b1!4m6!3m5!1s0x389eb71b20cc36fb:0xcd597eeeea8bd1fd!8m2!3d42.852745!4d74.6071624!16s%2Fg%2F11hf19nv2x?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D'

  return (
    <div className={styles['page'] + (ru ? ' ' + styles['page--ru'] : '')}>
      <header className={styles['page__header']}>
        <Link className={styles['page__logo']} to="/" aria-label={text.home}>
          <img src={headerLogo} alt="WEco" className={styles['page__logo-img']} />
        </Link>
        <nav className={styles['page__nav']}>
          <Link to="/">{text.home}</Link>
          <Link to="/profile">{text.profile}</Link>
          <Link to="/partners">{text.partners}</Link>
          <Link to="/contact" aria-current="page">{text.contact}</Link>
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

        <section className={styles['page__cards']} aria-label={ru ? 'Контакты WEco' : 'WEco contacts'}>
          <article className={styles['page__card']}>
            <div className={styles['page__icon-wrap']}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
            </div>
            <p className={styles['page__card-label']}>{text.email}</p>
            <p className={styles['page__card-value']}>
              <a className={styles['page__card-link']} href="mailto:weco9fip@gmail.com">weco9fip@gmail.com</a>
            </p>
            <p className={styles['page__card-hint']}>{text.writeUs}</p>
          </article>

          <article className={styles['page__card']}>
            <div className={styles['page__icon-wrap']}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 21s7-5.8 7-11a7 7 0 10-14 0c0 5.2 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </div>
            <p className={styles['page__card-label']}>{text.location}</p>
            <p className={styles['page__card-value']}>
              <a
                className={styles['page__card-link']}
                href={aucaMapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                {text.locationLinkText}
              </a>
            </p>
            <p className={styles['page__card-hint']}>{text.locationValue}</p>
            <p className={styles['page__card-hint']}>{text.findUs}</p>
          </article>

          <article className={styles['page__card']}>
            <div className={styles['page__icon-wrap']}>
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.4" cy="6.7" r="0.9" fill="currentColor" stroke="none" />
              </svg>
            </div>
            <p className={styles['page__card-label']}>{text.instagram}</p>
            <p className={styles['page__card-value']}>
              <a
                className={styles['page__card-link']}
                href="https://www.instagram.com/weco_kg/"
                target="_blank"
                rel="noreferrer"
              >
                @weco_kg
              </a>
            </p>
            <p className={styles['page__card-hint']}>{text.followUs}</p>
          </article>
        </section>
      </main>

      <footer className={styles['page__footer']}>
        <a
          className={styles['page__dot']}
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
        <Link className={styles['page__dot']} to="/contact" aria-label={ru ? 'Контакты' : 'Contact'}>!</Link>
      </footer>
    </div>
  )
}
