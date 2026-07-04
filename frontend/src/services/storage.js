const KEYS = {
  users: 'nizam_users',
  properties: 'nizam_properties',
  conversations: 'nizam_conversations',
  tickets: 'nizam_tickets',
  currentUser: 'nizam_current_user',
  location: 'nizam_location',
}

function read(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export const storage = {
  getUsers: () => read(KEYS.users, []),
  saveUsers: (users) => write(KEYS.users, users),

  getProperties: () => read(KEYS.properties, []),
  saveProperties: (props) => write(KEYS.properties, props),

  getConversations: () => read(KEYS.conversations, []),
  saveConversations: (convs) => write(KEYS.conversations, convs),

  getTickets: () => read(KEYS.tickets, []),
  saveTickets: (tickets) => write(KEYS.tickets, tickets),

  getCurrentUser: () => read(KEYS.currentUser, null),
  setCurrentUser: (user) => write(KEYS.currentUser, user),
  clearCurrentUser: () => localStorage.removeItem(KEYS.currentUser),

  getLocation: () => localStorage.getItem(KEYS.location) || 'Nizamabad',
  setLocation: (loc) => localStorage.setItem(KEYS.location, loc),
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatTime(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now - d
  if (diff < 86400000 && d.getDate() === now.getDate()) {
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }
  if (diff < 172800000) return 'Yesterday'
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function formatListedAgo(dateStr, t) {
  if (!dateStr) return ''
  const days = Math.floor((Date.now() - new Date(dateStr)) / 86400000)
  if (days === 0) return t('listedToday')
  if (days === 1) return t('listedOneDay')
  return t('listedDays').replace('{n}', String(days))
}

export function formatPropertySummary(property, t) {
  const parts = []
  if (property.type === 'agriculture' && property.acres) {
    parts.push(`${property.acres} ${t('acres')}`)
  } else if (property.bedrooms > 0) {
    parts.push(`${property.bedrooms} ${t('bed')}`)
  }
  if (property.type !== 'agriculture' && property.sqft > 0) {
    parts.push(`${property.sqft.toLocaleString('en-IN')} ${t('sqft')}`)
  }
  if (property.facing) {
    parts.push(`${property.facing} ${t('facing')}`)
  }
  return parts.length ? parts.join(' · ') : property.title
}
