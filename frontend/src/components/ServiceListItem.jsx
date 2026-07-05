import Icon from './Icon'
import { SERVICE_COLORS, getServiceIcon } from '../data/localServices'

export default function ServiceListItem({
  title,
  subtitle,
  icon,
  serviceId,
  color = 'teal',
  meta,
  availableNow,
  onClick,
}) {
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
        <Icon
          name={getServiceIcon(serviceId, icon)}
          size={28}
          filled
          style={{ color: palette.dot }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-text">{title}</p>
        <p className="mt-0.5 text-sm text-muted">{subtitle}</p>
        {(meta || availableNow) && (
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted">
            {availableNow && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                {meta?.availableLabel}
              </span>
            )}
            {meta?.rating && (
              <span className="inline-flex items-center gap-0.5">
                <Icon name="star" size={12} filled className="text-accent" />
                {meta.rating}
              </span>
            )}
          </div>
        )}
      </div>

      <Icon name="chevron_right" size={20} className="shrink-0 text-muted-light" />
    </button>
  )
}
