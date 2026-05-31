import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import headerLogo from '../../assets/header-logo.png'
import { login } from '../../api/auth'
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './LoginFormPage.module.css'

export default function LoginFormPage() {
  const { locale } = useLanguage()
  const ru = locale === 'ru'
  const navigate = useNavigate()
  const location = useLocation()
  const successMsg = (location.state as { message?: string } | null)?.message ?? ''

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const text = {
    home: ru ? 'Главная' : 'Home',
    login: ru ? 'Вход' : 'Login',
    back: ru ? 'Назад' : 'Back',
    hello: ru ? 'ПРИВЕТ!' : 'HELLO!',
    username: ru ? 'Имя пользователя' : 'Username',
    password: ru ? 'Пароль' : 'Password',
    loggingIn: ru ? 'Входим...' : 'Logging in...',
    logIn: ru ? 'ВОЙТИ' : 'LOG IN',
    noAccount: ru ? 'Нет аккаунта?' : 'No account?',
    register: ru ? 'Регистрация' : 'Register',
    invalidCredentials: ru ? 'Неверное имя пользователя или пароль' : 'Invalid username or password',
    loginFailed: ru ? 'Не удалось войти. Попробуйте еще раз.' : 'Login failed. Please try again.',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const token = await login(username, password)
      localStorage.setItem('token', token)
      navigate('/profile', { replace: true })
    } catch (err: unknown) {
      const msg = (err as Error).message
      setError(msg === 'invalid_credentials' ? text.invalidCredentials : text.loginFailed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles['page'] + (ru ? ' ' + styles['page--ru'] : '')}>
      <header className={styles['page__header']}>
        <Link className={styles['page__logo']} to="/" aria-label={text.home}>
          <img src={headerLogo} alt="WEco" className={styles['page__logo-img']} />
        </Link>
        <nav className={styles['page__nav']}>
          <Link to="/">{text.home}</Link>
          <Link to="/login">{text.login}</Link>
        </nav>
        <LanguageToggle />
        <button className={styles['page__back']} onClick={() => navigate(-1)} aria-label={text.back}>
          &#8592;
        </button>
      </header>

      <main className={styles['page__main']}>
        <h1 className={styles['page__title']}>{text.hello}</h1>
        {successMsg && <p className={styles['page__success']}>{successMsg}</p>}
        <form className={styles['page__form']} onSubmit={handleSubmit} noValidate>
          <input
            className={styles['page__input']}
            type="text"
            placeholder={text.username}
            value={username}
            onChange={e => { setUsername(e.target.value); setError('') }}
            autoComplete="username"
          />
          <input
            className={styles['page__input']}
            type="password"
            placeholder={text.password}
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            autoComplete="current-password"
          />
          {error && <p className={styles['page__error']}>{error}</p>}
          <button
            className={styles['page__btn']}
            type="submit"
            disabled={!username || !password || loading}
          >
            {loading ? text.loggingIn : text.logIn}
          </button>
        </form>
        <p className={styles['page__link']}>
          {text.noAccount} <Link to="/register">{text.register}</Link>
        </p>
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
