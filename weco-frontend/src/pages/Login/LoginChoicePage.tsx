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
    <div className={styles['page']}>
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
        <span className={styles['page__dot'] + ' ' + styles['page__dot--icon']}>&#169;</span>
        <span className={styles['page__dot'] + ' ' + styles['page__dot--icon']}>&#x2139;</span>
        <span className={styles['page__dot']} />
        <span className={styles['page__dot'] + ' ' + styles['page__dot--active']} />
      </footer>
    </div>
  )
}
