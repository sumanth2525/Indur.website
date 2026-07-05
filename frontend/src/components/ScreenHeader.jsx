import BackButton from './BackButton'
import LanguageToggle from './LanguageToggle'

export default function ScreenHeader({ fallback, right }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-white px-3 py-2 lg:px-6">
      <BackButton fallback={fallback} />
      <div className="flex items-center gap-2">
        {right}
        <LanguageToggle />
      </div>
    </header>
  )
}
