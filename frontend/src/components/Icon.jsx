export default function Icon({ name, size = 24, className = '', filled = false, style, ...props }) {
  const opsz = Math.min(48, Math.max(20, Math.round(size)))

  return (
    <span
      className={`material-symbols-outlined inline-flex shrink-0 items-center justify-center select-none leading-none notranslate ${className}`}
      style={{
        fontSize: size,
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' ${opsz}`,
        ...style,
      }}
      aria-hidden={props['aria-label'] ? undefined : true}
      {...props}
    >
      {name}
    </span>
  )
}
