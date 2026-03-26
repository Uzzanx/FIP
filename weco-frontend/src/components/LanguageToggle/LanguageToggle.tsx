import { useLanguage } from '../../i18n/LanguageContext'
import styles from './LanguageToggle.module.css'

interface Props {
  tone?: 'light' | 'dark'
}

export default function LanguageToggle({ tone = 'light' }: Props) {
  const { locale, setLocale } = useLanguage()
  const isDarkTone = tone === 'dark'

  return (
    <div
      className={styles['toggle'] + (isDarkTone ? ' ' + styles['toggle--dark'] : '')}
      role="group"
      aria-label="Language switch"
    >
      <span
        className={styles['thumb'] + (locale === 'ru' ? ' ' + styles['thumb--right'] : '')}
        aria-hidden="true"
      />

      <button
        type="button"
        className={styles['option'] + (locale === 'en' ? ' ' + styles['option--active'] : '')}
        onClick={() => setLocale('en')}
        aria-label="Switch to English"
        aria-pressed={locale === 'en'}
      >
        ENG
      </button>
      <button
        type="button"
        className={styles['option'] + (locale === 'ru' ? ' ' + styles['option--active'] : '')}
        onClick={() => setLocale('ru')}
        aria-label="Переключить на русский"
        aria-pressed={locale === 'ru'}
      >
        RU
      </button>
    </div>
  )
}
