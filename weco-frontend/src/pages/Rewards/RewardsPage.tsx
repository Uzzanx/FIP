import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import headerLogo from '../../assets/header-logo.png'
import { getRewards, redeemReward } from '../../api/rewards'
import { getMe } from '../../api/users'
import type { Reward } from '../../api/rewards'
import type { UserProfile } from '../../api/users'
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './RewardsPage.module.css'

export default function RewardsPage() {
  const { locale } = useLanguage()
  const ru = locale === 'ru'
  const navigate = useNavigate()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [rewards, setRewards] = useState<Reward[]>([])
  const [loading, setLoading] = useState(true)
  const [flash, setFlash] = useState<{ id: number; type: 'success' | 'error'; msg: string } | null>(null)

  const text = {
    home: ru ? 'Главная' : 'Home',
    profile: ru ? 'Профиль' : 'Profile',
    back: ru ? 'Назад' : 'Back',
    loading: ru ? 'Загрузка...' : 'Loading...',
    title: ru ? 'ВАШИ НАГРАДЫ' : 'AWARDS YOU HAVE',
    yourBonuses: ru ? 'ВАШИ БОНУСЫ' : 'YOUR BONUSES',
    spend: ru ? 'ТРАТЬТЕ БОНУСЫ У НАШИХ ПАРТНЕРОВ' : 'SPEND YOUR BONUSES WITH OUR PARTNERS',
    noRewards: ru ? 'Сейчас нет доступных наград.' : 'No rewards available right now.',
    pts: ru ? 'баллов' : 'pts',
    redeem: ru ? 'ОБМЕНЯТЬ' : 'REDEEM',
    redeemed: ru ? 'Успешно!' : 'Redeemed!',
    notEnough: ru ? 'Недостаточно баллов' : 'Not enough points',
    errorTryAgain: ru ? 'Ошибка, попробуйте еще раз' : 'Error, try again',
  }

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
      setFlash({ id: rewardId, type: 'success', msg: text.redeemed })
      Promise.all([getMe(), getRewards()])
        .then(([profile, list]) => { setUser(profile); setRewards(list) })
        .catch(() => {})
    } else {
      const msg = result.error === 'not_enough_points' ? text.notEnough : text.errorTryAgain
      setFlash({ id: rewardId, type: 'error', msg })
    }
    setTimeout(() => setFlash(null), 3000)
  }

  if (loading) {
    return (
      <div className={styles['page']}>
        <p className={styles['page__loading']}>{text.loading}</p>
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
          <Link to="/profile">{text.profile}</Link>
        </nav>
        <LanguageToggle />
        <button className={styles['page__back']} onClick={() => navigate(-1)} aria-label={text.back}>
          &#8592;
        </button>
      </header>

      <main className={styles['page__main']}>
        <h1 className={styles['page__title']}>{text.title}</h1>

        <div className={styles['page__points-bar']}>
          <span className={styles['page__points-label']}>{text.yourBonuses}</span>
          <strong className={styles['page__points-value']}>{user?.total_points ?? 0}</strong>
        </div>

        <p className={styles['page__section-title']}>{text.spend}</p>

        {rewards.length === 0
          ? <p className={styles['page__muted']}>{text.noRewards}</p>
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
                    <p className={styles['page__card-price']}>{reward.price} {text.pts}</p>
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
                      {text.redeem}
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
