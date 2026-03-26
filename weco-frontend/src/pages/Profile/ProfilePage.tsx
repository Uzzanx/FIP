import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import headerLogo from '../../assets/header-logo.png'
import Modal from '../../components/Modal/Modal'
import { getMe, getQRObjectUrl, getRedemptions } from '../../api/users'
import type { UserProfile, Redemption } from '../../api/users'
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const { locale } = useLanguage()
  const ru = locale === 'ru'
  const dateLocale = ru ? 'ru-RU' : 'en-US'
  const navigate = useNavigate()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [redemptions, setRedemptions] = useState<Redemption[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Redemption | null>(null)

  useEffect(() => {
    let blobUrl: string | null = null

    async function load() {
      try {
        const [profile, qr, reds] = await Promise.all([
          getMe(),
          getQRObjectUrl().catch(() => null),
          getRedemptions().catch(() => []),
        ])
        setUser(profile)
        if (qr) { blobUrl = qr; setQrUrl(qr) }
        setRedemptions(Array.isArray(reds) ? reds : [])
      } catch {
        // 401 is handled by apiFetch (clears token + redirects to /login)
      } finally {
        setLoading(false)
      }
    }

    load()
    return () => { if (blobUrl) URL.revokeObjectURL(blobUrl) }
  }, [])

  const activeRedemptions = redemptions.filter(
    r => !r.is_used && new Date(r.expires_at) > new Date()
  )

  const text = {
    loading: ru ? 'Загрузка...' : 'Loading...',
    home: ru ? 'Главная' : 'Home',
    rewards: ru ? 'Награды' : 'Rewards',
    back: ru ? 'Назад' : 'Back',
    hello: ru ? 'Привет' : 'Hello',
    useBonuses: ru ? 'ИСПОЛЬЗОВАТЬ БОНУСЫ' : 'USE EXISTING BONUSES',
    yourBonuses: ru ? 'ВАШИ БОНУСЫ' : 'YOUR BONUSES',
    wow: ru ? 'Отличный результат!' : 'Wow, great job!',
    getMore: ru ? 'ПОЛУЧИТЬ БОЛЬШЕ БОНУСОВ' : 'GET MORE BONUSES',
    qrUnavailable: ru ? 'QR недоступен' : 'QR unavailable',
    scanHint: ru ? 'Сканируйте этот QR-код на нашем боксе' : 'Scan this QR code on our box',
    stepsTitle: ru ? 'ШАГИ ДЛЯ ПОЛУЧЕНИЯ БОНУСА' : 'STEPS TO GET THE BONUS',
    step1: ru ? 'Покажите QR сканеру WEco-бокса' : 'Show your QR to the WEco box scanner',
    step2: ru ? 'Откройте страницу Verify в приложении' : 'Open the Verify page in the app',
    step3: ru ? 'Нажмите START и дождитесь подтверждения' : 'Press START and wait for confirmation',
    verifyBottle: ru ? 'ПОДТВЕРДИТЬ БУТЫЛКУ' : 'VERIFY BOTTLE',
    pickupTitle: ru ? 'МОИ НАГРАДЫ К ВЫДАЧЕ' : 'MY REWARDS TO PICK UP',
    rewardFallback: ru ? 'Награда' : 'Reward',
    code: ru ? 'Код' : 'Code',
    received: ru ? 'Получено' : 'Received',
    expires: ru ? 'Действует до' : 'Expires',
    pickupHintPrefix: ru ? 'Вы можете получить эту награду в любой' : 'You can pick up this reward at any',
    partnerLocation: ru ? 'партнерской точке' : 'partner location',
  }

  if (loading) {
    return (
      <div className={styles['page']}>
        <div className={styles['page__loading']}>{text.loading}</div>
      </div>
    )
  }

  return (
    <div className={styles['page']}>
      <header className={styles['page__header']}>
        <div className={styles['page__logo']}>
          <img src={headerLogo} alt="WEco" className={styles['page__logo-img']} />
        </div>
        <nav className={styles['page__nav']}>
          <Link to="/">{text.home}</Link>
          <Link to="/rewards">{text.rewards}</Link>
        </nav>
        <LanguageToggle />
        <button className={styles['page__back']} onClick={() => navigate(-1)} aria-label={text.back}>
          &#8592;
        </button>
      </header>

      <main className={styles['page__main']}>
        <section className={styles['page__greeting']}>
          <div className={styles['page__avatar']}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className={styles['page__username']}>{text.hello}, {user?.username}!</p>
            {user?.status && <p className={styles['page__status']}>{user.status}</p>}
          </div>
        </section>

        <button className={styles['page__use-btn']} onClick={() => navigate('/rewards')}>
          {text.useBonuses}
        </button>

        <section className={styles['page__points-section']}>
          <p className={styles['page__section-label']}>{text.yourBonuses}</p>
          <div className={styles['page__points-bar']}>
            <span className={styles['page__points-value']}>{user?.total_points ?? 0}</span>
            <span className={styles['page__points-sub']}>{text.wow}</span>
          </div>
        </section>

        <section className={styles['page__qr-section']}>
          <p className={styles['page__section-label']}>{text.getMore}</p>
          {qrUrl
            ? <img src={qrUrl} alt="QR code" className={styles['page__qr-img']} />
            : <p className={styles['page__muted']}>{text.qrUnavailable}</p>
          }
          <p className={styles['page__muted']}>{text.scanHint}</p>
        </section>

        <section className={styles['page__steps-section']}>
          <p className={styles['page__section-label']}>{text.stepsTitle}</p>
          <ol className={styles['page__steps']}>
            <li data-n="1">{text.step1}</li>
            <li data-n="2">{text.step2}</li>
            <li data-n="3">{text.step3}</li>
          </ol>
        </section>

        <button className={styles['page__verify-btn']} onClick={() => navigate('/verify')}>
          {text.verifyBottle}
        </button>

        {activeRedemptions.length > 0 && (
          <section className={styles['page__rewards-section']}>
            <p className={styles['page__section-label']}>{text.pickupTitle}</p>
            <div className={styles['page__rewards-grid']}>
              {activeRedemptions.map(r => (
                <button
                  key={r.id}
                  className={styles['page__reward-card']}
                  onClick={() => setSelected(r)}
                >
                  {r.reward_image && (
                    <img src={r.reward_image} alt={r.reward_title} className={styles['page__reward-img']} />
                  )}
                  <p className={styles['page__reward-title']}>{r.reward_title ?? text.rewardFallback}</p>
                  <p className={styles['page__reward-code']}>{r.code}</p>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      <Modal open={selected !== null} onClose={() => setSelected(null)}>
        {selected && (
          <div className={styles['page__modal-content']}>
            {selected.reward_image && (
              <img src={selected.reward_image} alt={selected.reward_title} className={styles['page__modal-img']} />
            )}
            <h2 className={styles['page__modal-title']}>{selected.reward_title ?? text.rewardFallback}</h2>
            {selected.reward_description && (
              <p className={styles['page__modal-desc']}>{selected.reward_description}</p>
            )}
            <p className={styles['page__modal-meta']}>{text.code}: <strong>{selected.code}</strong></p>
            <p className={styles['page__modal-meta']}>
              {text.received}: {new Date(selected.created_at).toLocaleDateString(dateLocale)}
            </p>
            <p className={styles['page__modal-meta']}>
              {text.expires}: {new Date(selected.expires_at).toLocaleDateString(dateLocale)}
            </p>
            <p className={styles['page__modal-hint']}>
              {text.pickupHintPrefix}{' '}
              <Link to="/#locations" onClick={() => setSelected(null)}>{text.partnerLocation}</Link>.
            </p>
          </div>
        )}
      </Modal>

      <footer className={styles['page__footer']}>
        <span className={styles['page__dot'] + ' ' + styles['page__dot--icon']}>&#169;</span>
        <span className={styles['page__dot'] + ' ' + styles['page__dot--icon']}>&#x2139;</span>
        <span className={styles['page__dot']} />
        <span className={styles['page__dot'] + ' ' + styles['page__dot--active']} />
      </footer>
    </div>
  )
}
