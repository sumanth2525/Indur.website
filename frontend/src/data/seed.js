import { storage, generateId } from '../services/storage'
import { MOCK_IMAGES } from './mockImages'

const SEED_VERSION = '4'

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
    images: MOCK_IMAGES.bhk2.slice(0, 3),
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
    images: MOCK_IMAGES.land,
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
    images: MOCK_IMAGES.bhk3.slice(0, 3),
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
    type: 'apartment',
    purpose: 'sell',
    title: '3BHK Premium Flat, Dichpally',
    description:
      'Premium 3BHK with wide balcony, pooja room, and covered car parking. Gated community with children\'s play area.',
    price: 8500000,
    location: { area: 'Dichpally', city: 'Nizamabad', lat: 18.71, lng: 78.12 },
    images: [MOCK_IMAGES.bhk3[2], MOCK_IMAGES.bhk3[3], MOCK_IMAGES.bhk3[0]],
    sellerId: 'user-priya',
    status: 'active',
    sqft: 1650,
    bedrooms: 3,
    facing: 'East',
    readyToMove: true,
    views: 112,
    createdAt: '2026-02-10T09:00:00Z',
  },
  {
    id: 'prop-5',
    type: 'apartment',
    purpose: 'rent',
    title: '2BHK Furnished Apartment, Nizamabad Town',
    description:
      'Fully furnished 2BHK near bus stand with Wi-Fi, AC in both bedrooms, and covered parking. Ideal for working professionals.',
    price: 18000,
    location: { area: 'Nizamabad Town', city: 'Nizamabad', lat: 18.67, lng: 78.09 },
    images: [MOCK_IMAGES.bhk2[1], MOCK_IMAGES.bhk2[2]],
    sellerId: 'user-ravi',
    status: 'active',
    sqft: 1100,
    bedrooms: 2,
    facing: 'South',
    readyToMove: true,
    views: 41,
    createdAt: '2026-03-12T11:00:00Z',
  },
  {
    id: 'prop-6',
    type: 'apartment',
    purpose: 'sell',
    title: '1BHK Starter Flat, Jakranpally',
    description:
      'Affordable 1BHK flat ideal for singles or young couples. Ready to move with 24/7 water and near main road connectivity.',
    price: 3200000,
    location: { area: 'Jakranpally', city: 'Nizamabad', lat: 18.68, lng: 78.10 },
    images: MOCK_IMAGES.bhk1,
    sellerId: 'user-priya',
    status: 'active',
    sqft: 650,
    bedrooms: 1,
    facing: 'North',
    readyToMove: true,
    views: 28,
    createdAt: '2026-03-15T09:00:00Z',
  },
  {
    id: 'prop-7',
    type: 'agriculture',
    purpose: 'sell',
    title: 'Agriculture Land, 2 Acres — Bodhan',
    description:
      'Fertile red-soil agriculture land suitable for paddy, cotton, and vegetables. Borewell with motor, road-facing, clear title. Near Bodhan market yard.',
    price: 2400000,
    location: { area: 'Bodhan', city: 'Nizamabad', lat: 18.66, lng: 77.89 },
    images: MOCK_IMAGES.agriculture.slice(0, 2),
    sellerId: 'user-ravi',
    status: 'active',
    sqft: 0,
    acres: 2,
    bedrooms: 0,
    facing: 'East',
    readyToMove: false,
    views: 45,
    createdAt: '2026-03-08T07:00:00Z',
  },
  {
    id: 'prop-8',
    type: 'agriculture',
    purpose: 'sell',
    title: 'Farm Land, 3.5 Acres — Kamareddy Road',
    description:
      'Level agriculture plot with existing mango plantation. Drip irrigation setup, compound wall on two sides. Ideal for farming or farmhouse development.',
    price: 4200000,
    location: { area: 'Kamareddy Road', city: 'Nizamabad', lat: 18.70, lng: 78.05 },
    images: MOCK_IMAGES.agriculture.slice(1, 3),
    sellerId: 'user-priya',
    status: 'active',
    sqft: 0,
    acres: 3.5,
    bedrooms: 0,
    facing: 'North',
    readyToMove: false,
    views: 62,
    createdAt: '2026-02-28T12:00:00Z',
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

const DEMO_IDS = new Set(DEMO_PROPERTIES.map((p) => p.id))

function mergeDemoProperties(existing) {
  const byId = new Map(existing.map((p) => [p.id, p]))
  for (const demo of DEMO_PROPERTIES) {
    if (byId.has(demo.id)) {
      byId.set(demo.id, { ...byId.get(demo.id), ...demo })
    } else {
      byId.set(demo.id, demo)
    }
  }
  const userCreated = existing.filter((p) => !DEMO_IDS.has(p.id))
  return [...DEMO_PROPERTIES.map((d) => byId.get(d.id)), ...userCreated]
}

export function seedIfEmpty() {
  const storedVersion = localStorage.getItem('nizam_seed_version')
  const hasData = storage.getProperties().length > 0

  if (!hasData) {
    storage.saveUsers(DEMO_USERS)
    storage.saveProperties(DEMO_PROPERTIES)
    storage.saveConversations(DEMO_CONVERSATIONS)
    localStorage.setItem('nizam_seed_version', SEED_VERSION)
    return
  }

  if (storedVersion !== SEED_VERSION) {
    storage.saveProperties(mergeDemoProperties(storage.getProperties()))
    localStorage.setItem('nizam_seed_version', SEED_VERSION)
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

export function getPropertySaveCount(propertyId) {
  const users = storage.getUsers()
  return users.reduce((count, u) => count + (u.saved?.includes(propertyId) ? 1 : 0), 0)
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
  agriculture: 'bg-lime-100 text-lime-800',
}
