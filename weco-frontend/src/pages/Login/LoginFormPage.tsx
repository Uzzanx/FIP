import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import headerLogo from '../../assets/header-logo.png'
import { login } from '../../api/auth'
import styles from './LoginFormPage.module.css'

export default function LoginFormPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const successMsg = (location.state as { message?: string } | null)?.message ?? ''

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
      setError(msg === 'invalid_credentials' ? 'Invalid username or password' : 'Login failed. Please try again.')
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
        {successMsg && <p className={styles['page__success']}>{successMsg}</p>}
        <form className={styles['page__form']} onSubmit={handleSubmit} noValidate>
          <input
            className={styles['page__input']}
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => { setUsername(e.target.value); setError('') }}
            autoComplete="username"
          />
          <input
            className={styles['page__input']}
            type="password"
            placeholder="Password"
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
            {loading ? 'Logging in...' : 'LOG IN'}
          </button>
        </form>
        <p className={styles['page__link']}>
          No account? <Link to="/register">Register</Link>
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
