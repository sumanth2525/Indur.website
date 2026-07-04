export default function Icon({ name, size = 24, className = '', filled = false, style, ...props }) {
  return (
    <span
      className={`material-symbols-outlined select-none leading-none ${className}`}
      style={{
        fontSize: size,
        width: size,
        height: size,
        fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
        ...style,
      }}
      aria-hidden={props['aria-label'] ? undefined : true}
      {...props}
    >
      {name}
    </span>
  )
}
