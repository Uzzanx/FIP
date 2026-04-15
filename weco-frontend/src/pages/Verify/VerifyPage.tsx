import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import headerLogo from '../../assets/header-logo.png'
import { getActiveSession, startVerification } from '../../api/verify'
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './VerifyPage.module.css'

type Status = 'idle' | 'checking' | 'success' | 'failed' | 'no-session'

export default function VerifyPage() {
  const { locale } = useLanguage()
  const ru = locale === 'ru'
  const navigate = useNavigate()
  const [status, setStatus] = useState<Status>('idle')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const text = {
    home: ru ? 'Главная' : 'Home',
    profile: ru ? 'Профиль' : 'Profile',
    back: ru ? 'Назад' : 'Back',
    title: ru ? 'ПОДТВЕРЖДЕНИЕ' : 'VERIFICATION',
    start: ru ? 'СТАРТ' : 'START',
    retry: ru ? 'ПОВТОРИТЬ' : 'RETRY',
    ready: ru ? 'ГОТОВО' : 'READY',
    loading: ru ? 'ЗАГРУЗКА...' : 'LOADING...',
    success: ru ? 'УСПЕХ' : 'SUCCESS',
    failed: ru ? 'ОШИБКА' : 'FAILED',
    noSession: ru ? 'НЕТ СЕССИИ' : 'NO SESSION',
    checking: ru ? 'Идет проверка...' : 'Verification in progress...',
    successMsg: ru ? 'Успех! Перенаправляем в профиль...' : 'Success! Redirecting to your profile...',
    failedMsg: ru ? 'Проверка не пройдена.' : 'Verification failed.',
    noSessionMsg: ru ? 'Нет активной сессии. Отсканируйте QR на боксе и попробуйте снова.' : 'No active session. Scan your QR on the box and try again.',
  }

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
    'idle': text.ready,
    'checking': text.loading,
    'success': text.success,
    'failed': text.failed,
    'no-session': text.noSession,
  }

  const msgText: Record<Status, string> = {
    'idle': '',
    'checking': text.checking,
    'success': text.successMsg,
    'failed': text.failedMsg,
    'no-session': text.noSessionMsg,
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
          <Link to="/">{text.home}</Link>
          <Link to="/profile">{text.profile}</Link>
        </nav>
        <LanguageToggle />
        <button className={styles['page__back']} onClick={() => navigate(-1)} aria-label={text.back}>
          &#8592;
        </button>
      </header>

      <main className={styles['page__main']}>
        <h1 className={styles['page__title']}>{text.title}</h1>

        <div className={styles['page__btn-wrap']}>
          {(status === 'idle' || status === 'no-session') && (
            <button className={styles['page__start-btn']} onClick={handleStart}>
              {text.start}
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
              {text.retry}
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
