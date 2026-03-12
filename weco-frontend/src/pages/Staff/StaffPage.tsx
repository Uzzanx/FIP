import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import headerLogo from '../../assets/header-logo.png'
import { getPickupLocations } from '../../api/machines'
import { previewRedemption, claimRedemption } from '../../api/staff'
import type { PickupLocation } from '../../api/machines'
import type { PreviewResult } from '../../api/staff'
import styles from './StaffPage.module.css'

export default function StaffPage() {
  const navigate = useNavigate()
  const [staffKey, setStaffKey] = useState('')
  const [locations, setLocations] = useState<PickupLocation[]>([])
  const [locationId, setLocationId] = useState<number | ''>('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<PreviewResult | null>(null)
  const [message, setMessage] = useState<{ text: string; kind: 'ok' | 'error' } | null>(null)
  const [confirmed, setConfirmed] = useState(false)

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
      setMessage({ text: res.error ?? 'Check failed.', kind: 'error' })
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
      setMessage({ text: res.error ?? 'Claim failed.', kind: 'error' })
      return
    }
    setConfirmed(true)
    setPreview(null)
    setCode('')
    setMessage({ text: 'Great! Now the user can get the reward!', kind: 'ok' })
  }

  const barClass = styles['page__status-bar'] + (loading ? ' ' + styles['page__status-bar--loading'] : message?.kind === 'ok' && confirmed ? ' ' + styles['page__status-bar--ok'] : '')

  return (
    <div className={styles['page']}>
      <header className={styles['page__header']}>
        <div className={styles['page__logo']}>
          <img src={headerLogo} alt="WEco" className={styles['page__logo-img']} />
        </div>
        <nav className={styles['page__nav']}>
          <Link to="/">Home</Link>
          <Link to="/login">Login / Sign in</Link>
        </nav>
        <button className={styles['page__back']} onClick={() => navigate(-1)} aria-label="Back">
          &#8592;
        </button>
      </header>

      <main className={styles['page__main']}>
        <h1 className={styles['page__title']}>{preview ? 'VERIFICATION' : 'HELLO!'}</h1>

        <div className={styles['page__form']}>
          <label className={styles['page__label']}>Staff key</label>
          <input
            className={styles['page__input']}
            type="password"
            placeholder="Enter staff key"
            value={staffKey}
            onChange={e => { setStaffKey(e.target.value); resetResult() }}
            autoComplete="off"
          />

          <label className={styles['page__label']}>Location</label>
          <select
            className={styles['page__select']}
            value={locationId}
            onChange={e => {
              setLocationId(e.target.value === '' ? '' : Number(e.target.value))
              resetResult()
            }}
          >
            <option value="">— Choose location —</option>
            {locations.map(l => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>

          {code && (
            <div className={styles['page__code-badge']}>
              <p className={styles['page__label']}>User's verification code</p>
              <div className={styles['page__code-display']}>{code}</div>
            </div>
          )}

          <label className={styles['page__label']}>Enter the user's verification code</label>
          <input
            className={styles['page__input']}
            type="text"
            placeholder="Verification code"
            value={code}
            onChange={e => { setCode(e.target.value); resetResult() }}
          />

          <button
            className={styles['page__btn']}
            onClick={handleCheck}
            disabled={!canCheck || loading}
          >
            {loading ? 'Checking...' : 'VERIFY'}
          </button>
        </div>

        <div className={barClass}>
          <span className={styles['page__status-label']}>
            {loading ? 'LOADING...' : preview ? 'RESULT' : 'READY'}
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
                <p className={styles['page__preview-title']}>{preview.reward_title ?? 'Reward'}</p>
                {preview.username && (
                  <p className={styles['page__preview-meta']}>User: <strong>{preview.username}</strong></p>
                )}
                {preview.expires_at && (
                  <p className={styles['page__preview-meta']}>
                    Expires: {new Date(preview.expires_at).toLocaleDateString()}
                  </p>
                )}
                {preview.stock !== undefined && (
                  <p className={styles['page__preview-meta']}>Stock: <strong>{preview.stock}</strong></p>
                )}
                {preview.can_claim === false && (
                  <span className={styles['page__badge'] + ' ' + styles['page__badge--error']}>Cannot issue</span>
                )}
                {preview.can_claim === true && (
                  <span className={styles['page__badge'] + ' ' + styles['page__badge--ok']}>Can issue &#10003;</span>
                )}
              </div>
            </div>
            {preview.can_claim && (
              <button
                className={styles['page__btn'] + ' ' + styles['page__btn--confirm']}
                onClick={handleConfirm}
                disabled={loading}
              >
                CONFIRM
              </button>
            )}
          </div>
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
