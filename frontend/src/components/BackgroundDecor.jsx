import Icon from './Icon'

const icons = [
  { name: 'home', top: '12%', left: '8%', size: 28, rotate: -12 },
  { name: 'key', top: '8%', right: '12%', size: 24, rotate: 15 },
  { name: 'location_on', top: '38%', left: '4%', size: 22, rotate: -8 },
  { name: 'apartment', top: '55%', right: '6%', size: 30, rotate: 10 },
  { name: 'park', top: '72%', left: '10%', size: 26, rotate: -5 },
  { name: 'home', top: '85%', right: '15%', size: 20, rotate: 8 },
]

export default function BackgroundDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden" aria-hidden>
      {icons.map(({ name, top, left, right, size, rotate }, i) => (
        <Icon
          key={i}
          name={name}
          size={size}
          className="absolute text-black/[0.04]"
          style={{
            top,
            left,
            right,
            transform: `rotate(${rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}
