import { storage, generateId } from '../services/storage'

const DEMO_USERS = [
  {
    id: 'user-ravi',
    name: 'Ravi Kumar',
    phone: '+91 98765 43210',
    email: 'ravi@example.com',
    authProvider: 'google',
    location: 'Nizamabad',
    saved: [],
    views: 142,
  },
  {
    id: 'user-priya',
    name: 'Priya Sharma',
    phone: '+91 91234 56789',
    email: 'priya@example.com',
    authProvider: 'phone',
    location: 'Kanteshwar',
    saved: [],
    views: 89,
  },
]

const DEMO_PROPERTIES = [
  {
    id: 'prop-1',
    type: 'house',
    purpose: 'sell',
    title: '2BHK Independent House, Kanteshwar',
    description:
      'Spacious 2BHK independent house with east-facing entrance, modular kitchen, and covered parking. Located in a peaceful residential area near schools and markets.',
    price: 6800000,
    location: { area: 'Kanteshwar', city: 'Nizamabad', lat: 18.6725, lng: 78.0941 },
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    ],
    sellerId: 'user-ravi',
    status: 'active',
    sqft: 1200,
    bedrooms: 2,
    facing: 'East',
    readyToMove: true,
    views: 56,
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'prop-2',
    type: 'land',
    purpose: 'sell',
    title: 'Residential Plot, Armoor Road',
    description:
      'Clear-title residential plot ideal for building your dream home. 40×60 ft dimensions with road access and all approvals in place.',
    price: 4500000,
    location: { area: 'Armoor Road', city: 'Nizamabad', lat: 18.685, lng: 78.11 },
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'],
    sellerId: 'user-priya',
    status: 'active',
    sqft: 2400,
    bedrooms: 0,
    facing: 'North',
    readyToMove: false,
    views: 34,
    createdAt: '2026-03-05T08:00:00Z',
  },
  {
    id: 'prop-3',
    type: 'apartment',
    purpose: 'sell',
    title: '3BHK Apartment, Bodhan Road',
    description:
      'Modern 3BHK apartment in a gated community with 24/7 security, lift, and power backup. Close to Nizamabad city center.',
    price: 9200000,
    location: { area: 'Bodhan Road', city: 'Nizamabad', lat: 18.66, lng: 78.08 },
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    ],
    sellerId: 'user-ravi',
    status: 'active',
    sqft: 1850,
    bedrooms: 3,
    facing: 'West',
    readyToMove: true,
    views: 78,
    createdAt: '2026-02-20T14:00:00Z',
  },
  {
    id: 'prop-4',
    type: 'house',
    purpose: 'sell',
    title: '4BHK Villa, Dichpally',
    description:
      'Luxury villa with garden, servant quarters, and premium finishes. Perfect for families seeking space and privacy.',
    price: 15500000,
    location: { area: 'Dichpally', city: 'Nizamabad', lat: 18.71, lng: 78.12 },
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80'],
    sellerId: 'user-priya',
    status: 'active',
    sqft: 3200,
    bedrooms: 4,
    facing: 'East',
    readyToMove: true,
    views: 112,
    createdAt: '2026-02-10T09:00:00Z',
  },
]

const DEMO_CONVERSATIONS = [
  {
    id: 'conv-1',
    propertyId: 'prop-1',
    buyerId: 'user-priya',
    sellerId: 'user-ravi',
    messages: [
      { id: 'm1', senderId: 'user-priya', text: 'Is this property still available?', timestamp: '2026-03-10T09:30:00Z' },
      { id: 'm2', senderId: 'user-ravi', text: 'Yes, it is. Would you like to schedule a visit?', timestamp: '2026-03-10T09:42:00Z' },
    ],
    updatedAt: '2026-03-10T09:42:00Z',
  },
]

export function seedIfEmpty() {
  if (storage.getProperties().length === 0) {
    storage.saveUsers(DEMO_USERS)
    storage.saveProperties(DEMO_PROPERTIES)
    storage.saveConversations(DEMO_CONVERSATIONS)
  }
}

export function getUserById(id) {
  return storage.getUsers().find((u) => u.id === id)
}

export function getPropertyById(id) {
  return storage.getProperties().find((p) => p.id === id)
}

export function createUser({ name, phone, email, authProvider }) {
  const users = storage.getUsers()
  const user = {
    id: generateId(),
    name,
    phone: phone || '',
    email: email || '',
    authProvider,
    location: storage.getLocation(),
    saved: [],
    views: 0,
  }
  users.push(user)
  storage.saveUsers(users)
  return user
}

export function updateUser(userId, updates) {
  const users = storage.getUsers()
  const idx = users.findIndex((u) => u.id === userId)
  if (idx === -1) return null
  users[idx] = { ...users[idx], ...updates }
  storage.saveUsers(users)
  return users[idx]
}

export function createProperty(data, sellerId) {
  const props = storage.getProperties()
  const property = {
    id: generateId(),
    ...data,
    sellerId,
    status: 'active',
    views: 0,
    createdAt: new Date().toISOString(),
  }
  props.unshift(property)
  storage.saveProperties(props)
  return property
}

export function updateProperty(id, updates) {
  const props = storage.getProperties()
  const idx = props.findIndex((p) => p.id === id)
  if (idx === -1) return null
  props[idx] = { ...props[idx], ...updates }
  storage.saveProperties(props)
  return props[idx]
}

export function deleteProperty(id) {
  const props = storage.getProperties().filter((p) => p.id !== id)
  storage.saveProperties(props)
}

export function incrementPropertyViews(id) {
  const prop = getPropertyById(id)
  if (prop) updateProperty(id, { views: (prop.views || 0) + 1 })
}

export function toggleSaved(userId, propertyId) {
  const user = getUserById(userId)
  if (!user) return false
  const saved = user.saved || []
  const isSaved = saved.includes(propertyId)
  const newSaved = isSaved ? saved.filter((id) => id !== propertyId) : [...saved, propertyId]
  updateUser(userId, { saved: newSaved })
  return !isSaved
}

export function getOrCreateConversation(buyerId, sellerId, propertyId) {
  const convs = storage.getConversations()
  let conv = convs.find(
    (c) => c.propertyId === propertyId && c.buyerId === buyerId && c.sellerId === sellerId,
  )
  if (!conv) {
    conv = {
      id: generateId(),
      propertyId,
      buyerId,
      sellerId,
      messages: [],
      updatedAt: new Date().toISOString(),
    }
    convs.unshift(conv)
    storage.saveConversations(convs)
  }
  return conv
}

export function addMessage(conversationId, senderId, text) {
  const convs = storage.getConversations()
  const idx = convs.findIndex((c) => c.id === conversationId)
  if (idx === -1) return null
  const msg = { id: generateId(), senderId, text, timestamp: new Date().toISOString() }
  convs[idx].messages.push(msg)
  convs[idx].updatedAt = msg.timestamp
  storage.saveConversations(convs)
  return msg
}

export function createTicket(userId, subject, message) {
  const tickets = storage.getTickets()
  const ticket = {
    id: generateId(),
    userId,
    subject,
    message,
    status: 'open',
    createdAt: new Date().toISOString(),
  }
  tickets.unshift(ticket)
  storage.saveTickets(tickets)
  return ticket
}

export const TYPE_COLORS = {
  house: 'bg-emerald-100 text-emerald-700',
  land: 'bg-orange-100 text-orange-700',
  apartment: 'bg-blue-100 text-blue-700',
}
