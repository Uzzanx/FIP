import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import headerLogo from '../../assets/header-logo.png'
import Modal from '../../components/Modal/Modal'
import { getMe, getQRObjectUrl, getRedemptions } from '../../api/users'
import type { UserProfile, Redemption } from '../../api/users'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
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

  if (loading) {
    return (
      <div className={styles['page']}>
        <div className={styles['page__loading']}>Loading...</div>
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
          <Link to="/">Home</Link>
          <Link to="/rewards">Rewards</Link>
        </nav>
        <button className={styles['page__back']} onClick={() => navigate(-1)} aria-label="Back">
          &#8592;
        </button>
      </header>

      <main className={styles['page__main']}>
        <section className={styles['page__greeting']}>
          <div className={styles['page__avatar']}>
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className={styles['page__username']}>Hello, {user?.username}!</p>
            {user?.status && <p className={styles['page__status']}>{user.status}</p>}
          </div>
        </section>

        <button className={styles['page__use-btn']} onClick={() => navigate('/rewards')}>
          USE EXISTING BONUSES
        </button>

        <section className={styles['page__points-section']}>
          <p className={styles['page__section-label']}>YOUR BONUSES</p>
          <div className={styles['page__points-bar']}>
            <span className={styles['page__points-value']}>{user?.total_points ?? 0}</span>
            <span className={styles['page__points-sub']}>Wow, great job!</span>
          </div>
        </section>

        <section className={styles['page__qr-section']}>
          <p className={styles['page__section-label']}>GET MORE BONUSES</p>
          {qrUrl
            ? <img src={qrUrl} alt="QR code" className={styles['page__qr-img']} />
            : <p className={styles['page__muted']}>QR unavailable</p>
          }
          <p className={styles['page__muted']}>Scan this QR code on our box</p>
        </section>

        <section className={styles['page__steps-section']}>
          <p className={styles['page__section-label']}>STEPS TO GET THE BONUS</p>
          <ol className={styles['page__steps']}>
            <li data-n="1">Show your QR to the WEco box scanner</li>
            <li data-n="2">Open the Verify page in the app</li>
            <li data-n="3">Press START and wait for confirmation</li>
          </ol>
        </section>

        <button className={styles['page__verify-btn']} onClick={() => navigate('/verify')}>
          VERIFY BOTTLE
        </button>

        {activeRedemptions.length > 0 && (
          <section className={styles['page__rewards-section']}>
            <p className={styles['page__section-label']}>MY REWARDS TO PICK UP</p>
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
                  <p className={styles['page__reward-title']}>{r.reward_title ?? 'Reward'}</p>
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
            <h2 className={styles['page__modal-title']}>{selected.reward_title ?? 'Reward'}</h2>
            {selected.reward_description && (
              <p className={styles['page__modal-desc']}>{selected.reward_description}</p>
            )}
            <p className={styles['page__modal-meta']}>Code: <strong>{selected.code}</strong></p>
            <p className={styles['page__modal-meta']}>
              Received: {new Date(selected.created_at).toLocaleDateString()}
            </p>
            <p className={styles['page__modal-meta']}>
              Expires: {new Date(selected.expires_at).toLocaleDateString()}
            </p>
            <p className={styles['page__modal-hint']}>
              You can pick up this reward at any{' '}
              <Link to="/#locations" onClick={() => setSelected(null)}>partner location</Link>.
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
