import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import headerLogo from '../../assets/header-logo.png'
import { register } from '../../api/auth'
import styles from './RegisterPage.module.css'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = (): string => {
    if (!username.trim() || !password.trim() || !confirm.trim()) return 'All fields are required.'
    if (password.length < 6) return 'Password must be at least 6 characters.'
    if (password !== confirm) return 'Passwords do not match.'
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
      navigate('/login/form', { state: { message: 'Account created! Please log in.' } })
    } catch (err: unknown) {
      setError((err as Error).message || 'Registration failed.')
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
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
        </nav>
        <button className={styles['page__back']} onClick={() => navigate(-1)} aria-label="Back">
          &#8592;
        </button>
      </header>

      <main className={styles['page__main']}>
        <h1 className={styles['page__title']}>HELLO!</h1>
        <form className={styles['page__form']} onSubmit={handleSubmit} noValidate>
          <input
            className={styles['page__input']}
            type="text"
            placeholder="Your name"
            value={username}
            onChange={e => { setUsername(e.target.value); setError('') }}
            autoComplete="username"
          />
          <input
            className={styles['page__input']}
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            autoComplete="new-password"
          />
          <input
            className={styles['page__input']}
            type="password"
            placeholder="Repeat the password"
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
            {loading ? 'Creating...' : 'CREATE ACCOUNT'}
          </button>
        </form>
        <p className={styles['page__link']}>
          Already have an account? <Link to="/login/form">Log in</Link>
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
