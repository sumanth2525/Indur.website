import BackButton from '../components/BackButton'
import { useLanguage } from '../i18n/LanguageContext'

const CONTENT = {
  terms: {
    titleKey: 'termsTitle',
    bodyKey: 'termsBody',
  },
  privacy: {
    titleKey: 'privacyTitle',
    bodyKey: 'privacyBody',
  },
}

export default function LegalPage({ type }) {
  const { t } = useLanguage()
  const config = CONTENT[type]

  return (
    <div className="min-h-dvh bg-white">
      <header className="sticky top-0 z-30 flex items-center border-b border-border bg-white px-3 py-2">
        <BackButton fallback="/" />
      </header>
      <div className="px-6 py-10 lg:px-16">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight">{t(config.titleKey)}</h1>
          <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-muted">{t(config.bodyKey)}</p>
        </div>
      </div>
    </div>
  )
}
