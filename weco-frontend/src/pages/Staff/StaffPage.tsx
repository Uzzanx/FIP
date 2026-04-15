import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import headerLogo from '../../assets/header-logo.png'
import { getPickupLocations } from '../../api/machines'
import { previewRedemption, claimRedemption } from '../../api/staff'
import type { PickupLocation } from '../../api/machines'
import type { PreviewResult } from '../../api/staff'
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './StaffPage.module.css'

export default function StaffPage() {
  const { locale } = useLanguage()
  const ru = locale === 'ru'
  const dateLocale = ru ? 'ru-RU' : 'en-US'
  const navigate = useNavigate()
  const [staffKey, setStaffKey] = useState('')
  const [locations, setLocations] = useState<PickupLocation[]>([])
  const [locationId, setLocationId] = useState<number | ''>('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<PreviewResult | null>(null)
  const [message, setMessage] = useState<{ text: string; kind: 'ok' | 'error' } | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const text = {
    home: ru ? 'Главная' : 'Home',
    loginSignIn: ru ? 'Вход / Регистрация' : 'Login / Sign in',
    back: ru ? 'Назад' : 'Back',
    verification: ru ? 'ПРОВЕРКА' : 'VERIFICATION',
    hello: ru ? 'ПРИВЕТ!' : 'HELLO!',
    staffKey: ru ? 'Ключ сотрудника' : 'Staff key',
    enterStaffKey: ru ? 'Введите ключ сотрудника' : 'Enter staff key',
    location: ru ? 'Локация' : 'Location',
    chooseLocation: ru ? 'Выберите локацию' : 'Choose location',
    userCode: ru ? 'Код подтверждения пользователя' : 'User\'s verification code',
    enterUserCode: ru ? 'Введите код подтверждения пользователя' : 'Enter the user\'s verification code',
    verificationCode: ru ? 'Код подтверждения' : 'Verification code',
    checking: ru ? 'Проверяем...' : 'Checking...',
    verify: ru ? 'ПРОВЕРИТЬ' : 'VERIFY',
    loading: ru ? 'ЗАГРУЗКА...' : 'LOADING...',
    result: ru ? 'РЕЗУЛЬТАТ' : 'RESULT',
    ready: ru ? 'ГОТОВО' : 'READY',
    checkFailed: ru ? 'Проверка не удалась.' : 'Check failed.',
    claimFailed: ru ? 'Выдача не удалась.' : 'Claim failed.',
    claimSuccess: ru ? 'Отлично! Теперь пользователь может получить награду!' : 'Great! Now the user can get the reward!',
    rewardFallback: ru ? 'Награда' : 'Reward',
    user: ru ? 'Пользователь' : 'User',
    expires: ru ? 'Действует до' : 'Expires',
    stock: ru ? 'Остаток' : 'Stock',
    cannotIssue: ru ? 'Выдать нельзя' : 'Cannot issue',
    canIssue: ru ? 'Можно выдать' : 'Can issue',
    confirm: ru ? 'ПОДТВЕРДИТЬ' : 'CONFIRM',
  }

  useEffect(() => { getPickupLocations().then(setLocations) }, [])

  const canCheck = !!staffKey.trim() && locationId !== '' && !!code.trim()

  const resetResult = () => { setPreview(null); setMessage(null); setConfirmed(false) }

  const handleCheck = async () => {
    if (!canCheck) return
    setLoading(true)
    resetResult()
    const res = await previewRedemption(staffKey.trim(), Number(locationId), code.trim())
    setLoading(false)
    if (!res.ok) {
      setMessage({ text: res.error ?? text.checkFailed, kind: 'error' })
      return
    }
    setPreview(res.data ?? null)
  }

  const handleConfirm = async () => {
    if (!canCheck) return
    setLoading(true)
    const res = await claimRedemption(staffKey.trim(), Number(locationId), code.trim())
    setLoading(false)
    if (!res.ok) {
      setMessage({ text: res.error ?? text.claimFailed, kind: 'error' })
      return
    }
    setConfirmed(true)
    setPreview(null)
    setCode('')
    setMessage({ text: text.claimSuccess, kind: 'ok' })
  }

  const barClass = styles['page__status-bar'] + (loading ? ' ' + styles['page__status-bar--loading'] : message?.kind === 'ok' && confirmed ? ' ' + styles['page__status-bar--ok'] : '')

  return (
    <div className={styles['page']}>
      <header className={styles['page__header']}>
        <div className={styles['page__logo']}>
          <img src={headerLogo} alt="WEco" className={styles['page__logo-img']} />
        </div>
        <nav className={styles['page__nav']}>
          <Link to="/">{text.home}</Link>
          <Link to="/login">{text.loginSignIn}</Link>
        </nav>
        <LanguageToggle />
        <button className={styles['page__back']} onClick={() => navigate(-1)} aria-label={text.back}>
          &#8592;
        </button>
      </header>

      <main className={styles['page__main']}>
        <h1 className={styles['page__title']}>{preview ? text.verification : text.hello}</h1>

        <div className={styles['page__form']}>
          <label className={styles['page__label']}>{text.staffKey}</label>
          <input
            className={styles['page__input']}
            type="password"
            placeholder={text.enterStaffKey}
            value={staffKey}
            onChange={e => { setStaffKey(e.target.value); resetResult() }}
            autoComplete="off"
          />

          <label className={styles['page__label']}>{text.location}</label>
          <select
            className={styles['page__select']}
            value={locationId}
            onChange={e => {
              setLocationId(e.target.value === '' ? '' : Number(e.target.value))
              resetResult()
            }}
          >
            <option value="">- {text.chooseLocation} -</option>
            {locations.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>

          {code && (
            <div className={styles['page__code-badge']}>
              <p className={styles['page__label']}>{text.userCode}</p>
              <div className={styles['page__code-display']}>{code}</div>
            </div>
          )}

          <label className={styles['page__label']}>{text.enterUserCode}</label>
          <input
            className={styles['page__input']}
            type="text"
            placeholder={text.verificationCode}
            value={code}
            onChange={e => { setCode(e.target.value); resetResult() }}
          />

          <button
            className={styles['page__btn']}
            onClick={handleCheck}
            disabled={!canCheck || loading}
          >
            {loading ? text.checking : text.verify}
          </button>
        </div>

        <div className={barClass}>
          <span className={styles['page__status-label']}>
            {loading ? text.loading : preview ? text.result : text.ready}
          </span>
        </div>

        {message && (
          <p className={styles['page__flash'] + ' ' + styles[message.kind === 'ok' ? 'page__flash--ok' : 'page__flash--error']}>
            {message.text}
          </p>
        )}

        {preview && !confirmed && (
          <div className={styles['page__preview']}>
            <div className={styles['page__preview-row']}>
              {preview.reward_image && (
                <img src={preview.reward_image} alt={preview.reward_title} className={styles['page__preview-img']} />
              )}
              <div className={styles['page__preview-info']}>
                <p className={styles['page__preview-title']}>{preview.reward_title ?? text.rewardFallback}</p>
                {preview.username && (
                  <p className={styles['page__preview-meta']}>{text.user}: <strong>{preview.username}</strong></p>
                )}
                {preview.expires_at && (
                  <p className={styles['page__preview-meta']}>
                    {text.expires}: {new Date(preview.expires_at).toLocaleDateString(dateLocale)}
                  </p>
                )}
                {preview.stock !== undefined && (
                  <p className={styles['page__preview-meta']}>{text.stock}: <strong>{preview.stock}</strong></p>
                )}
                {preview.can_claim === false && (
                  <span className={styles['page__badge'] + ' ' + styles['page__badge--error']}>{text.cannotIssue}</span>
                )}
                {preview.can_claim === true && (
                  <span className={styles['page__badge'] + ' ' + styles['page__badge--ok']}>{text.canIssue} &#10003;</span>
                )}
              </div>
            </div>
            {preview.can_claim && (
              <button
                className={styles['page__btn'] + ' ' + styles['page__btn--confirm']}
                onClick={handleConfirm}
                disabled={loading}
              >
                {text.confirm}
              </button>
            )}
          </div>
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
