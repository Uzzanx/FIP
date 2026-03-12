import { Link, useNavigate } from 'react-router-dom'
import headerLogo from '../../assets/header-logo.png'
import styles from './LoginChoicePage.module.css'

export default function LoginChoicePage() {
  const navigate = useNavigate()

  return (
    <div className={styles['page']}>
      <header className={styles['page__header']}>
        <div className={styles['page__logo']}>
          <img src={headerLogo} alt="WEco" className={styles['page__logo-img']} />
        </div>
        <nav className={styles['page__nav']}>
          <Link to="/">Home</Link>
          <Link to="/profile">Profile</Link>
        </nav>
        <button className={styles['page__back']} onClick={() => navigate(-1)} aria-label="Back">
          &#8592;
        </button>
      </header>

      <main className={styles['page__main']}>
        <h1 className={styles['page__title']}>HELLO!</h1>
        <div className={styles['page__choices']}>
          <button className={styles['page__btn']} onClick={() => navigate('/login/form')}>
            Log in (by existing account)
          </button>
          <button className={styles['page__btn']} onClick={() => navigate('/register')}>
            Create a new account
          </button>
          <button
            className={styles['page__btn'] + ' ' + styles['page__btn--ghost']}
            onClick={() => navigate('/')}
          >
            Continue as a guest
          </button>
          <button
            className={styles['page__btn'] + ' ' + styles['page__btn--staff']}
            onClick={() => navigate('/staff')}
          >
            For staff only
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
