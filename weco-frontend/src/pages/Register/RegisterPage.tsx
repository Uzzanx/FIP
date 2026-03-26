import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import headerLogo from '../../assets/header-logo.png'
import { register } from '../../api/auth'
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './RegisterPage.module.css'

export default function RegisterPage() {
  const { locale } = useLanguage()
  const ru = locale === 'ru'
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const text = {
    home: ru ? 'Главная' : 'Home',
    login: ru ? 'Вход' : 'Login',
    back: ru ? 'Назад' : 'Back',
    hello: ru ? 'ПРИВЕТ!' : 'HELLO!',
    yourName: ru ? 'Ваше имя' : 'Your name',
    createPassword: ru ? 'Придумайте пароль' : 'Create a password',
    repeatPassword: ru ? 'Повторите пароль' : 'Repeat the password',
    creating: ru ? 'Создаем...' : 'Creating...',
    createAccount: ru ? 'СОЗДАТЬ АККАУНТ' : 'CREATE ACCOUNT',
    haveAccount: ru ? 'Уже есть аккаунт?' : 'Already have an account?',
    logIn: ru ? 'Войти' : 'Log in',
    allFields: ru ? 'Все поля обязательны.' : 'All fields are required.',
    passwordLength: ru ? 'Пароль должен быть не менее 6 символов.' : 'Password must be at least 6 characters.',
    passwordMatch: ru ? 'Пароли не совпадают.' : 'Passwords do not match.',
    registrationFailed: ru ? 'Регистрация не удалась.' : 'Registration failed.',
    createdMessage: ru ? 'Аккаунт создан! Пожалуйста, войдите.' : 'Account created! Please log in.',
  }

  const validate = (): string => {
    if (!username.trim() || !password.trim() || !confirm.trim()) return text.allFields
    if (password.length < 6) return text.passwordLength
    if (password !== confirm) return text.passwordMatch
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const msg = validate()
    if (msg) { setError(msg); return }
    setError('')
    setLoading(true)
    try {
      await register(username, password)
      navigate('/login/form', { state: { message: text.createdMessage } })
    } catch (err: unknown) {
      setError((err as Error).message || text.registrationFailed)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles['page']}>
      <header className={styles['page__header']}>
        <div className={styles['page__logo']}>
          <img src={headerLogo} alt="WEco" className={styles['page__logo-img']} />
        </div>
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
        <form className={styles['page__form']} onSubmit={handleSubmit} noValidate>
          <input
            className={styles['page__input']}
            type="text"
            placeholder={text.yourName}
            value={username}
            onChange={e => { setUsername(e.target.value); setError('') }}
            autoComplete="username"
          />
          <input
            className={styles['page__input']}
            type="password"
            placeholder={text.createPassword}
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            autoComplete="new-password"
          />
          <input
            className={styles['page__input']}
            type="password"
            placeholder={text.repeatPassword}
            value={confirm}
            onChange={e => { setConfirm(e.target.value); setError('') }}
            autoComplete="new-password"
          />
          {error && <p className={styles['page__error']}>{error}</p>}
          <button
            className={styles['page__btn']}
            type="submit"
            disabled={!username || !password || !confirm || loading}
          >
            {loading ? text.creating : text.createAccount}
          </button>
        </form>
        <p className={styles['page__link']}>
          {text.haveAccount} <Link to="/login/form">{text.logIn}</Link>
        </p>
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
