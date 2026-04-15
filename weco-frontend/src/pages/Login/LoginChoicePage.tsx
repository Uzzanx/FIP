import { Link, useNavigate } from 'react-router-dom'
import headerLogo from '../../assets/header-logo.png'
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './LoginChoicePage.module.css'

export default function LoginChoicePage() {
  const { locale } = useLanguage()
  const ru = locale === 'ru'
  const navigate = useNavigate()

  const text = {
    home: ru ? 'Главная' : 'Home',
    profile: ru ? 'Профиль' : 'Profile',
    back: ru ? 'Назад' : 'Back',
    hello: ru ? 'ПРИВЕТ!' : 'HELLO!',
    loginExisting: ru ? 'Войти (в существующий аккаунт)' : 'Log in (by existing account)',
    createAccount: ru ? 'Создать новый аккаунт' : 'Create a new account',
    guest: ru ? 'Продолжить как гость' : 'Continue as a guest',
    staff: ru ? 'Только для персонала' : 'For staff only',
  }

  return (
    <div className={styles['page'] + (ru ? ' ' + styles['page--ru'] : '')}>
      <header className={styles['page__header']}>
        <div className={styles['page__logo']}>
          <img src={headerLogo} alt="WEco" className={styles['page__logo-img']} />
        </div>
        <nav className={styles['page__nav']}>
          <Link to="/">{text.home}</Link>
          <Link to="/profile">{text.profile}</Link>
        </nav>
        <LanguageToggle />
        <button className={styles['page__back']} onClick={() => navigate(-1)} aria-label={text.back}>
          &#8592;
        </button>
      </header>

      <main className={styles['page__main']}>
        <h1 className={styles['page__title']}>{text.hello}</h1>
        <div className={styles['page__choices']}>
          <button className={styles['page__btn']} onClick={() => navigate('/login/form')}>
            {text.loginExisting}
          </button>
          <button className={styles['page__btn']} onClick={() => navigate('/register')}>
            {text.createAccount}
          </button>
          <button
            className={styles['page__btn'] + ' ' + styles['page__btn--ghost']}
            onClick={() => navigate('/')}
          >
            {text.guest}
          </button>
          <button
            className={styles['page__btn'] + ' ' + styles['page__btn--staff']}
            onClick={() => navigate('/staff')}
          >
            {text.staff}
          </button>
        </div>
      </main>

      <footer className={styles['page__footer']}>
        <a className={styles['page__dot']} href="https://www.instagram.com/weco_kg/" target="_blank" rel="noreferrer" aria-label="Instagram WEco KG">
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
