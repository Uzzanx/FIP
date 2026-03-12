import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import headerLogo from '../../assets/header-logo.png'
import { getActiveSession, startVerification } from '../../api/verify'
import styles from './VerifyPage.module.css'

type Status = 'idle' | 'checking' | 'success' | 'failed' | 'no-session'

export default function VerifyPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<Status>('idle')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Cleanup on unmount — no leaks
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleStart = async () => {
    stopPolling()
    setStatus('checking')
    try {
      const session = await getActiveSession()
      if (!session || !session.session_id) {
        setStatus('no-session')
        return
      }
      // POST start — UI trigger only, box may have already started
      try { await startVerification(session.session_id) } catch { /* ignore */ }

      // Polling every 2s
      intervalRef.current = setInterval(async () => {
        try {
          const poll = await getActiveSession()
          if (poll === null) {
            // Session cleared = verified
            stopPolling()
            setStatus('success')
            setTimeout(() => navigate('/profile'), 1500)
            return
          }
          const s = poll.status?.toLowerCase()
          if (s === 'success' || s === 'completed' || poll.is_bottle === true) {
            stopPolling()
            setStatus('success')
            setTimeout(() => navigate('/profile'), 1500)
          } else if (s === 'failed' || s === 'error') {
            stopPolling()
            setStatus('failed')
          }
          // else: still pending, keep polling
        } catch {
          // network error, keep polling
        }
      }, 2000)
    } catch {
      setStatus('failed')
    }
  }

  const handleRetry = () => {
    stopPolling()
    setStatus('idle')
  }

  const barClassMap: Record<Status, string> = {
    'idle': styles['page__status-bar'],
    'checking': styles['page__status-bar'] + ' ' + styles['page__status-bar--checking'],
    'success': styles['page__status-bar'] + ' ' + styles['page__status-bar--success'],
    'failed': styles['page__status-bar'] + ' ' + styles['page__status-bar--failed'],
    'no-session': styles['page__status-bar'] + ' ' + styles['page__status-bar--nosession'],
  }

  const barLabel: Record<Status, string> = {
    'idle': 'READY',
    'checking': 'LOADING...',
    'success': 'SUCCESS',
    'failed': 'FAILED',
    'no-session': 'NO SESSION',
  }

  const msgText: Record<Status, string> = {
    'idle': '',
    'checking': 'Verification in progress...',
    'success': 'Success! Redirecting to your profile...',
    'failed': 'Verification failed.',
    'no-session': 'No active session. Scan your QR on the box and try again.',
  }

  const msgClassMap: Record<Status, string> = {
    'idle': styles['page__message'],
    'checking': styles['page__message'] + ' ' + styles['page__message--checking'],
    'success': styles['page__message'] + ' ' + styles['page__message--success'],
    'failed': styles['page__message'] + ' ' + styles['page__message--failed'],
    'no-session': styles['page__message'] + ' ' + styles['page__message--nosession'],
  }

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
        <h1 className={styles['page__title']}>VERIFICATION</h1>

        <div className={styles['page__btn-wrap']}>
          {(status === 'idle' || status === 'no-session') && (
            <button className={styles['page__start-btn']} onClick={handleStart}>
              START
            </button>
          )}
          {status === 'checking' && (
            <div className={styles['page__start-btn'] + ' ' + styles['page__start-btn--loading']}>
              ...
            </div>
          )}
          {status === 'success' && (
            <div className={styles['page__start-btn'] + ' ' + styles['page__start-btn--success']}>
              &#10003;
            </div>
          )}
          {status === 'failed' && (
            <button
              className={styles['page__start-btn'] + ' ' + styles['page__start-btn--failed']}
              onClick={handleRetry}
            >
              RETRY
            </button>
          )}
        </div>

        <div className={barClassMap[status]}>
          <span className={styles['page__status-label']}>{barLabel[status]}</span>
        </div>

        {status !== 'idle' && msgText[status] && (
          <p className={msgClassMap[status]} role="status">
            {msgText[status]}
          </p>
        )}
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
