import { Link, useNavigate } from 'react-router-dom'
import headerLogo from '../../assets/header-logo.png'
import WEcoMap from '../../components/Map/WEcoMap'
import LanguageToggle from '../../components/LanguageToggle/LanguageToggle'
import { useLanguage } from '../../i18n/LanguageContext'
import styles from './HomePage.module.css'

export default function HomePage() {
  const { locale } = useLanguage()
  const ru = locale === 'ru'
  const navigate = useNavigate()
  const isAuth = !!localStorage.getItem('token')

  const text = {
    navHome: ru ? 'Главная' : 'Home',
    navLogin: ru ? 'Вход/Регистрация' : 'Login/Sign in',
    navProfile: ru ? 'Профиль' : 'Profile',
    navContact: ru ? 'Контакты' : 'Contact',
    navPartners: ru ? 'Партнеры' : 'Partners',
    aboutUs: ru ? 'О НАС' : 'ABOUT US',
    howItWorks: ru ? 'КАК ЭТО РАБОТАЕТ' : 'HOW IT WORKS',
    mission: ru ? 'НАША МИССИЯ' : 'OUR MISSION',
    locations: ru ? 'НАШИ ЛОКАЦИИ' : 'OUR LOCATIONS',
    bonuses: ru ? 'БОНУСНАЯ СИСТЕМА WEco' : 'WEco BONUS SYSTEM',
    getBonus: ru ? 'ПОЛУЧАЙ БОНУС' : 'GET YOUR BONUS',
    yourBonus: ru ? 'ТВОЙ БОНУС' : 'YOUR BONUS',
    aboutP1: ru
      ? 'Каждый день в Кыргызстане выбрасываются тысячи пластиковых бутылок, и мы решили это изменить.'
      : 'Every day, thousands of plastic bottles are thrown away in Kyrgyzstan, and we decided to change it.',
    aboutP2: ru
      ? 'Наши умные боксы установлены в Places with high concentrations of people (shops, public places, shopping malls in the future), принимают бутылки и превращают их в бонусы и скидки от партнеров.'
      : 'Our smart boxes are installed in Places with high concentrations of people (shops, public places, shopping malls in the future), accept bottles and turn them into bonuses and discounts from partners.',
    aboutP3: ru
      ? 'Сделаем Кыргызстан чище вместе.'
      : 'Let\'s make Kyrgyzstan cleaner together.',
    aboutP4: ru ? 'Присоединяйтесь к нам!' : 'Join us!',
    tagline: ru ? '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Сила WEco в чистой жизни' : '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Life is clean with WEco\'s force',
    missionP1: ru
      ? 'Наша миссия - формировать культуру ответственности, чтобы экология стала делом каждого.'
      : 'Our mission is to build a culture of responsibility so that ecology becomes everyone\'s business.',
    missionP2: ru ? 'Присоединяйся и стань частью этого!' : 'Join us and become part of it!',
    steps: ru
      ? [
        {
          title: 'Найдите ближайший WEco-бокс',
          text: 'Используйте карту на сайте, чтобы выбрать удобную точку сбора в местах с высокой концентрацией людей.',
        },
        {
          title: 'Отсканируйте QR-код',
          text: 'На эко-боксе размещен уникальный QR-код. После сканирования система связывает сдачу бутылок с вашим личным аккаунтом.',
        },
        {
          title: 'Сдайте пластиковые бутылки',
          text: 'Поместите пустые пластиковые бутылки и крышки в бокс для дальнейшей сортировки и переработки.',
        },
        {
          title: 'Получите бонусные баллы',
          text: 'За каждую сданную бутылку на ваш аккаунт автоматически начисляются эко-баллы.',
        },
        {
          title: 'Обменивайте баллы на выгоды',
          text: 'Накопленные баллы можно использовать для получения скидок, подарков и специальных предложений от наших партнеров.',
        },
        {
          title: 'Следите за своим вкладом',
          text: 'В личном кабинете отображается количество сданного пластика, накопленные баллы и ваш экологический вклад.',
        },
      ]
      : [
        {
          title: 'Find the nearest WEco box',
          text: 'Use the map on the website to choose a convenient collection point in places with high concentrations of people.',
        },
        {
          title: 'Scan the QR code',
          text: 'Each eco-box has a unique QR code. After scanning, the system links bottle returns to your personal account.',
        },
        {
          title: 'Return plastic bottles',
          text: 'Place empty plastic bottles and caps into the box for sorting and recycling.',
        },
        {
          title: 'Get bonus points',
          text: 'For every returned bottle, eco-points are automatically credited to your account.',
        },
        {
          title: 'Exchange points for benefits',
          text: 'Use your points for discounts, gifts, and special offers from our partners.',
        },
        {
          title: 'Track your impact',
          text: 'In your profile, you can see collected plastic totals, bonus points, and your eco impact.',
        },
      ],
    bonusP1: ru
      ? 'WEco использует накопительную программу лояльности, знакомую пользователям по сервисам крупных компаний.'
      : 'WEco uses a loyalty points model familiar to users of major retail and service brands.',
    bonusP2: ru
      ? 'За каждую сданную пластиковую бутылку пользователь получает эко-баллы, которые автоматически начисляются в личный аккаунт после сканирования QR-кода.'
      : 'For each returned plastic bottle, users receive eco-points that are automatically added to their account after QR verification.',
    bonusP3: ru
      ? 'Система работает по принципу «действие = вознаграждение»: чем больше пластика пользователь сдает, тем больше баллов накапливает.'
      : 'The system follows the principle of action equals reward: the more plastic users return, the more points they collect.',
    bonusP4: ru
      ? 'Такой подход делает экологичное поведение простым, привычным и выгодным, как в популярных бонусных программах.'
      : 'This approach makes sustainable behavior simple, familiar, and valuable, similar to popular loyalty programs.',
    locationsSub: ru ? 'Места, где можно найти наши боксы' : 'Places where you can find our boxes',
  }

  return (
    <div className={styles['page'] + (ru ? ' ' + styles['page--ru'] : '')}>
      {/* Top header: logo + page links + arrows */}
      <header className={styles['page__header']}>
        <div className={styles['page__logo']}>
          <img src={headerLogo} alt="WEco" className={styles['page__logo-img']} />
        </div>
        <nav className={styles['page__nav']}>
          <a href="#top">{text.navHome}</a>
          <a href="#" onClick={e => { e.preventDefault(); navigate('/login') }}>{text.navLogin}</a>
          <a href="#" onClick={e => { e.preventDefault(); navigate(isAuth ? '/profile' : '/login') }}>{text.navProfile}</a>
          <a href="#" onClick={e => { e.preventDefault(); navigate('/partners') }}>{text.navPartners}</a>
          <a href="#" onClick={e => { e.preventDefault(); navigate('/contact') }}>{text.navContact}</a>
        </nav>
        <LanguageToggle />
      </header>

      {/* Sub-nav: section anchors */}
      <nav className={styles['page__subnav']}>
        <a href="#about">{text.aboutUs}</a>
        <a href="#how-it-works">{text.howItWorks}</a>
        <a href="#mission">{text.mission}</a>
        <a href="#locations">{text.locations}</a>
        <a href="#bonuses">{text.bonuses}</a>
      </nav>

      <section id="top" className={styles['page__hero']}>
        <div className={styles['page__hero-lines']}>
          <span className={styles['page__hero-line']}>{text.getBonus}</span>
          <button
            className={styles['page__btn']}
            onClick={() => navigate(isAuth ? '/profile' : '/login')}
          >
            {text.yourBonus}
          </button>
          <span className={styles['page__hero-line']}>{text.getBonus}</span>
        </div>
      </section>

      <section id="about" className={styles['page__section--about']}>
        <div className={styles['page__about-leaf']}>
          <h2 className={styles['page__section-title--light']}>{text.aboutUs}</h2>
          <div className={styles['page__about-content']}>
            <div className={styles['page__about-text']}>
              <p className={styles['page__section-text--light']}>
                {text.aboutP1}
              </p>
              <p className={styles['page__section-text--light']}>{text.aboutP2}</p>
              <p className={styles['page__section-text--light']}>{text.aboutP3}</p>
              <p className={styles['page__section-text--light']}>{text.aboutP4}</p>
              <p className={styles['page__about-tagline']}>{text.tagline}</p>
            </div>
            <div className={styles['page__about-logo-wrap']} />
          </div>
        </div>
      </section>

      <section id="mission" className={styles['page__section']}>
        <h2 className={styles['page__section-title']}>{text.mission}</h2>
        <p className={styles['page__section-text']}>
          {text.missionP1}
        </p>
        <p className={styles['page__section-text']}>{text.missionP2}</p>
      </section>

      <section id="how-it-works" className={styles['page__section']}>
        <h2 className={styles['page__section-title']}>{text.howItWorks}</h2>
        <ol className={styles['page__steps-list']}>
          {text.steps.map((step, index) => (
            <li key={step.title} className={styles['page__step-item']}>
              <p className={styles['page__step-title']}>
                <span className={styles['page__step-number']}>{index + 1}.</span> {step.title}
              </p>
              <p className={styles['page__step-text']}>{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="bonuses" className={styles['page__section--bonuses']}>
        <div className={styles['page__bonuses-leaf']}>
          <h2 className={styles['page__section-title--light']}>{text.bonuses}</h2>
          <p className={styles['page__section-text--light']}>{text.bonusP1}</p>
          <p className={styles['page__section-text--light']}>{text.bonusP2}</p>
          <p className={styles['page__section-text--light']}>{text.bonusP3}</p>
          <p className={styles['page__section-text--light']}>{text.bonusP4}</p>
        </div>
      </section>

      <section id="locations" className={styles['page__section'] + ' ' + styles['page__section--locations']}>
        <h2 className={styles['page__section-title']}>{text.locations}</h2>
        <p className={styles['page__locations-sub']}>{text.locationsSub}</p>
        <WEcoMap />
      </section>

      <footer className={styles['page__footer']}>
        <a
          className={styles['page__dot']}
          href="https://www.instagram.com/weco_kg/"
          target="_blank"
          rel="noreferrer"
          aria-label={ru ? 'Instagram WEco KG' : 'Instagram WEco KG'}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5"/>
            <circle cx="12" cy="12" r="5"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
          </svg>
        </a>
        <Link className={styles['page__dot']} to="/contact" aria-label={ru ? 'Контакты' : 'Contact'}>
          !
        </Link>
      </footer>
    </div>
  )
}
