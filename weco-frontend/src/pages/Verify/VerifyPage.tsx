import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import headerLogo from '../../assets/header-logo.png'
import { getActiveSession, getVerificationSession, startVerification } from '../../api/verify'
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './VerifyPage.module.css'

type Status = 'idle' | 'pending' | 'in-progress' | 'completed' | 'failed' | 'expired' | 'error' | 'start-error' | 'no-session'

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
  const resultText = {
    accepted: ru ? 'Бутылка принята' : 'Bottle accepted',
    acceptedMsg: ru ? 'Бутылка успешно распознана. Балл добавлен на ваш баланс.' : 'Bottle verified successfully. Points were added to your balance.',
    rejected: ru ? 'Отклонено' : 'Rejected',
    rejectedMsg: ru ? 'Объект не распознан как пластиковая бутылка. Баллы не были начислены.' : 'The object was not recognized as a plastic bottle. No points were added.',
    expired: ru ? 'Сессия истекла' : 'Session expired',
    expiredMsg: ru ? 'Отсканируйте QR-код заново и начните новую проверку.' : 'Please scan your QR again and start a new verification.',
    error: ru ? 'Ошибка проверки' : 'Verification failed',
    errorMsg: ru ? 'Что-то пошло не так во время проверки. Попробуйте еще раз.' : 'Something went wrong. Please try again.',
    startError: ru ? 'Ошибка запуска' : 'Start error',
    startErrorMsg: ru ? 'Не удалось начать проверку. Попробуйте отсканировать QR-код заново.' : 'Could not start verification. Please try scanning the QR code again.',
    pendingTitle: ru ? 'Сессия готова' : 'Session ready',
    pending: ru ? 'Нажмите START, чтобы начать проверку.' : 'Press START to begin verification.',
    inProgress: ru ? 'Проверка выполняется...' : 'Verification in progress...',
    inProgressMsg: ru ? 'Бокс проверяет объект. Пожалуйста, подождите.' : 'The box is checking the object. Please wait.',
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (status !== 'completed') return

    const timer = window.setTimeout(() => {
      navigate('/profile')
    }, 2500)

    return () => window.clearTimeout(timer)
  }, [status, navigate])

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleStart = async () => {
    stopPolling()
    setStatus('pending')
    try {
      const session = await getActiveSession()
      const sessionId = session?.session_id || session?.id
      if (!sessionId) {
        setStatus('no-session')
        return
      }
      try {
        await startVerification(sessionId)
      } catch {
        setStatus('start-error')
        return
      }
      setStatus('in-progress')

      // Polling every 2s
      intervalRef.current = setInterval(async () => {
        try {
          const poll = await getVerificationSession(sessionId)
          const s = poll.status?.toLowerCase()
          if (s === 'completed') {
            stopPolling()
            setStatus('completed')
          } else if (s === 'failed') {
            stopPolling()
            setStatus('failed')
          } else if (s === 'expired') {
            stopPolling()
            setStatus('expired')
          } else if (s === 'pending') {
            setStatus('pending')
          } else if (s === 'in_progress') {
            setStatus('in-progress')
          } else {
            stopPolling()
            setStatus('error')
          }
        } catch {
          stopPolling()
          setStatus('error')
        }
      }, 2000)
    } catch {
      setStatus('error')
    }
  }

  const handleRetry = () => {
    stopPolling()
    setStatus('idle')
  }

  const barClassMap: Record<Status, string> = {
    'idle': styles['page__status-bar'],
    'pending': styles['page__status-bar'] + ' ' + styles['page__status-bar--checking'],
    'in-progress': styles['page__status-bar'] + ' ' + styles['page__status-bar--checking'],
    'completed': styles['page__status-bar'] + ' ' + styles['page__status-bar--success'],
    'failed': styles['page__status-bar'] + ' ' + styles['page__status-bar--failed'],
    'expired': styles['page__status-bar'] + ' ' + styles['page__status-bar--expired'],
    'error': styles['page__status-bar'] + ' ' + styles['page__status-bar--failed'],
    'start-error': styles['page__status-bar'] + ' ' + styles['page__status-bar--failed'],
    'no-session': styles['page__status-bar'] + ' ' + styles['page__status-bar--nosession'],
  }

  const barLabel: Record<Status, string> = {
    'idle': text.ready,
    'pending': resultText.pendingTitle,
    'in-progress': resultText.inProgress,
    'completed': resultText.accepted,
    'failed': resultText.rejected,
    'expired': resultText.expired,
    'error': resultText.error,
    'start-error': resultText.startError,
    'no-session': text.noSession,
  }

  const msgText: Record<Status, string> = {
    'idle': '',
    'pending': resultText.pending,
    'in-progress': resultText.inProgressMsg,
    'completed': resultText.acceptedMsg,
    'failed': resultText.rejectedMsg,
    'expired': resultText.expiredMsg,
    'error': resultText.errorMsg,
    'start-error': resultText.startErrorMsg,
    'no-session': text.noSessionMsg,
  }

  const msgClassMap: Record<Status, string> = {
    'idle': styles['page__message'],
    'pending': styles['page__message'] + ' ' + styles['page__message--checking'],
    'in-progress': styles['page__message'] + ' ' + styles['page__message--checking'],
    'completed': styles['page__message'] + ' ' + styles['page__message--success'],
    'failed': styles['page__message'] + ' ' + styles['page__message--failed'],
    'expired': styles['page__message'] + ' ' + styles['page__message--expired'],
    'error': styles['page__message'] + ' ' + styles['page__message--failed'],
    'start-error': styles['page__message'] + ' ' + styles['page__message--failed'],
    'no-session': styles['page__message'] + ' ' + styles['page__message--nosession'],
  }

  return (
    <div className={styles['page'] + (ru ? ' ' + styles['page--ru'] : '')}>
      <header className={styles['page__header']}>
        <Link className={styles['page__logo']} to="/" aria-label={text.home}>
          <img src={headerLogo} alt="WEco" className={styles['page__logo-img']} />
        </Link>
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
          {(status === 'pending' || status === 'in-progress') && (
            <div className={styles['page__start-btn'] + ' ' + styles['page__start-btn--loading']}>
              ...
            </div>
          )}
          {status === 'completed' && (
            <div className={styles['page__start-btn'] + ' ' + styles['page__start-btn--success']}>
              &#10003;
            </div>
          )}
          {(status === 'failed' || status === 'expired' || status === 'error' || status === 'start-error') && (
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
