import Icon from './Icon'
import { SERVICE_COLORS } from '../data/localServices'

export default function ServiceListItem({ title, subtitle, color = 'teal', onClick }) {
  const palette = SERVICE_COLORS[color] || SERVICE_COLORS.teal

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-2xl border border-border bg-white px-4 py-4 text-left transition-colors hover:bg-surface"
    >
      <div
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
        style={{ backgroundColor: palette.bg }}
      >
        <span
          className="h-7 w-7 rounded-full"
          style={{ backgroundColor: palette.dot }}
          aria-hidden
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-text">{title}</p>
        <p className="mt-0.5 text-sm text-muted">{subtitle}</p>
      </div>

      <Icon name="chevron_right" size={20} className="shrink-0 text-muted-light" />
    </button>
  )
}
