import { useEffect, useCallback } from 'react'
import styles from './Modal.module.css'
import { useLanguage } from '../../i18n/LanguageContext'

interface Props {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function Modal({ open, onClose, children }: Props) {
  const { locale } = useLanguage()
  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() },
    [onClose]
  )

  useEffect(() => {
    if (!open) return
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, handleKey])

  if (!open) return null

  return (
    <div className={styles['modal']} role="dialog" aria-modal="true">
      <div className={styles['modal__backdrop']} onClick={onClose} />
      <div className={styles['modal__box']}>
        <button
          className={styles['modal__close']}
          onClick={onClose}
          aria-label={locale === 'ru' ? 'Закрыть' : 'Close'}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  )
}
