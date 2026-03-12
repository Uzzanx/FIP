import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import headerLogo from '../../assets/header-logo.png'
import { getRewards, redeemReward } from '../../api/rewards'
import { getMe } from '../../api/users'
import type { Reward } from '../../api/rewards'
import type { UserProfile } from '../../api/users'
import styles from './RewardsPage.module.css'

export default function RewardsPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const [flash, setFlash] = useState<{ id: number; type: 'success' | 'error'; msg: string } | null>(null)

  useEffect(() => {
    Promise.all([getMe(), getRewards()])
      .then(([profile, list]) => { setUser(profile); setRewards(list) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleRedeem = async (rewardId: number) => {
    setFlash(null)
    const result = await redeemReward(rewardId)
    if (result.ok) {
      setFlash({ id: rewardId, type: 'success', msg: 'Redeemed!' })
      Promise.all([getMe(), getRewards()])
        .then(([profile, list]) => { setUser(profile); setRewards(list) })
        .catch(() => {})
    } else {
      const msg = result.error === 'not_enough_points' ? 'Not enough points' : 'Error, try again'
      setFlash({ id: rewardId, type: 'error', msg })
    }
    setTimeout(() => setFlash(null), 3000)
  }

  if (loading) {
    return (
      <div className={styles['page']}>
        <p className={styles['page__loading']}>Loading...</p>
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
          <Link to="/profile">Profile</Link>
        </nav>
        <button className={styles['page__back']} onClick={() => navigate(-1)} aria-label="Back">
          &#8592;
        </button>
      </header>

      <main className={styles['page__main']}>
        <h1 className={styles['page__title']}>AWARDS YOU HAVE</h1>

        <div className={styles['page__points-bar']}>
          <span className={styles['page__points-label']}>YOUR BONUSES</span>
          <strong className={styles['page__points-value']}>{user?.total_points ?? 0}</strong>
        </div>

        <p className={styles['page__section-title']}>SPEND YOUR BONUSES WITH OUR PARTNERS</p>

        {rewards.length === 0
          ? <p className={styles['page__muted']}>No rewards available right now.</p>
          : (
            <div className={styles['page__grid']}>
              {rewards.map(reward => (
                <div key={reward.id} className={styles['page__card']}>
                  {reward.image && (
                    <img src={reward.image} alt={reward.title} className={styles['page__card-img']} />
                  )}
                  <div className={styles['page__card-body']}>
                    <p className={styles['page__card-title']}>{reward.title}</p>
                    {reward.description && (
                      <p className={styles['page__card-desc']}>{reward.description}</p>
                    )}
                    <p className={styles['page__card-price']}>{reward.price} pts</p>
                    {flash?.id === reward.id && (
                      <p className={
                        styles['page__card-flash'] + ' ' + styles[
                          flash.type === 'success' ? 'page__card-flash--success' : 'page__card-flash--error'
                        ]
                      }>
                        {flash.msg}
                      </p>
                    )}
                    <button
                      className={styles['page__card-btn']}
                      onClick={() => handleRedeem(reward.id)}
                      disabled={!user || user.total_points < reward.price}
                    >
                      REDEEM
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        }
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
