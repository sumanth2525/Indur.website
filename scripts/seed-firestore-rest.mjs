/**
 * Seeds sample Firestore documents so collections appear in Firebase Console.
 * Uses gcloud user credentials (firebase/gcloud login required).
 *
 * Run: node seed-firestore-rest.mjs
 */
import { execSync } from 'node:child_process'

const projectId = 'nizamabad-698d9'
const baseUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`

function getAccessToken() {
  try {
    return execSync('gcloud auth print-access-token', { encoding: 'utf8' }).trim()
  } catch {
    throw new Error('Run: gcloud auth login && gcloud config set project nizamabad-698d9')
  }
}

function str(v) {
  return { stringValue: String(v) }
}

function num(v) {
  return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v }
}

function bool(v) {
  return { booleanValue: v }
}

function ts(date = new Date()) {
  return { timestampValue: date.toISOString() }
}

function map(fields) {
  return { mapValue: { fields } }
}

function arr(values) {
  return { arrayValue: { values } }
}

async function createDoc(collection, documentId, fields) {
  const url = documentId
    ? `${baseUrl}/${collection}?documentId=${encodeURIComponent(documentId)}`
    : `${baseUrl}/${collection}`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  })
  const body = await res.text()
  if (!res.ok) {
    throw new Error(`Failed ${collection}/${documentId || '(auto)'}: ${res.status} ${body}`)
  }
  return JSON.parse(body)
}

const token = getAccessToken()
const now = new Date()
const demoUserId = 'demo-indur-user'
const demoListingId = 'demo-listing-2bhk'
const demoConversationId = 'demo-conversation-1'
const demoTicketId = 'demo-ticket-1'

console.log(`Seeding Firestore project: ${projectId}\n`)

await createDoc('profiles', demoUserId, {
  name: str('Demo User'),
  email: str('demo@indur.site'),
  phone: str('+919876543210'),
  photoURL: str(''),
  location: str('Nizamabad'),
  saved: arr([str(demoListingId)]),
  views: num(0),
  authProvider: str('google'),
  lang: str('en'),
  createdAt: ts(now),
  updatedAt: ts(now),
})

await createDoc('publicProfiles', demoUserId, {
  name: str('Demo User'),
  photoURL: str(''),
  updatedAt: ts(now),
})

await createDoc('listings', demoListingId, {
  type: str('house'),
  purpose: str('sell'),
  title: str('2BHK House in Nizamabad Town'),
  description: str('Sample listing for Indur Real estate. Ready to move, east facing, near main road.'),
  price: num(4500000),
  location: map({
    area: str('Kanteshwar'),
    mandal: str('Nizamabad Urban'),
    city: str('Nizamabad'),
    lat: num(18.6725),
    lng: num(78.0941),
  }),
  images: arr([
    str('https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ]),
  sellerId: str(demoUserId),
  status: str('active'),
  sqft: num(1200),
  bedrooms: num(2),
  facing: str('East'),
  readyToMove: bool(true),
  views: num(12),
  saveCount: num(1),
  createdAt: ts(now),
  updatedAt: ts(now),
})

await createDoc('listings', 'demo-listing-rent', {
  type: str('apartment'),
  purpose: str('rent'),
  title: str('2BHK Apartment for Rent — Armoor Road'),
  description: str('Sample rental listing. Furnished flat with parking.'),
  price: num(18000),
  location: map({
    area: str('Armoor Road'),
    city: str('Nizamabad'),
    lat: num(18.79),
    lng: num(78.29),
  }),
  images: arr([
    str('https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ]),
  sellerId: str(demoUserId),
  status: str('active'),
  sqft: num(1100),
  bedrooms: num(2),
  facing: str('North'),
  readyToMove: bool(true),
  views: num(5),
  saveCount: num(0),
  createdAt: ts(now),
  updatedAt: ts(now),
})

await createDoc('conversations', demoConversationId, {
  propertyId: str(demoListingId),
  buyerId: str('demo-buyer-user'),
  sellerId: str(demoUserId),
  messages: arr([
    map({
      id: str('msg-1'),
      senderId: str('demo-buyer-user'),
      text: str('Is this property still available?'),
      timestamp: ts(now),
    }),
  ]),
  createdAt: ts(now),
  updatedAt: ts(now),
})

await createDoc('tickets', demoTicketId, {
  userId: str(demoUserId),
  subject: str('Help posting my first ad'),
  message: str('Sample support ticket so the tickets collection is visible in Console.'),
  status: str('open'),
  createdAt: ts(now),
})

const serviceCategories = [
  { id: 'packers-movers', titleKey: 'servicePackersMovers', subtitleKey: 'servicePackersMoversSub', color: 'teal', icon: 'local_shipping', sortOrder: 0 },
  { id: 'home-cleaning', titleKey: 'serviceHomeCleaning', subtitleKey: 'serviceHomeCleaningSub', color: 'blue', icon: 'cleaning_services', sortOrder: 1 },
  { id: 'electrician', titleKey: 'serviceElectrician', subtitleKey: 'serviceElectricianSub', color: 'amber', icon: 'electrical_services', sortOrder: 2 },
  { id: 'plumber', titleKey: 'servicePlumber', subtitleKey: 'servicePlumberSub', color: 'teal', icon: 'plumbing', sortOrder: 3 },
  { id: 'painting', titleKey: 'servicePainting', subtitleKey: 'servicePaintingSub', color: 'blue', icon: 'format_paint', sortOrder: 4 },
  { id: 'legal-docs', titleKey: 'serviceLegalDocs', subtitleKey: 'serviceLegalDocsSub', color: 'amber', icon: 'gavel', sortOrder: 5 },
]

for (const category of serviceCategories) {
  await createDoc('serviceCategories', category.id, {
    titleKey: str(category.titleKey),
    subtitleKey: str(category.subtitleKey),
    color: str(category.color),
    icon: str(category.icon),
    sortOrder: num(category.sortOrder),
    status: str('active'),
    createdAt: ts(now),
    updatedAt: ts(now),
  })
}

const serviceProviders = [
  {
    id: 'provider-packers-movers',
    serviceId: 'packers-movers',
    rating: 4.8,
    reviewCount: 212,
    experience: '6 yrs',
    availability: '24/7',
    distance: '3 km',
    aboutKey: 'servicePackersMoversAbout',
    servicesOfferedKeys: ['serviceOfferedHouseShifting', 'serviceOfferedOfficeRelocation', 'serviceOfferedPackingMaterial', 'serviceOfferedLoadingUnloading'],
    provider: { name: 'Sai Movers & Packers', locationKey: 'locationKanteshwar', initial: 'S', phone: '9876543210', whatsapp: '9876543210' },
  },
  {
    id: 'provider-home-cleaning',
    serviceId: 'home-cleaning',
    rating: 4.6,
    reviewCount: 148,
    experience: '4 yrs',
    availability: '8 AM–8 PM',
    distance: '2 km',
    aboutKey: 'serviceHomeCleaningAbout',
    servicesOfferedKeys: ['serviceOfferedDeepCleaning', 'serviceOfferedBathroomCleaning', 'serviceOfferedKitchenCleaning', 'serviceOfferedSofaCarpet'],
    provider: { name: 'Sparkle Home Services', locationKey: 'locationArmoorRoad', initial: 'S', phone: '9876501234', whatsapp: '9876501234' },
  },
  {
    id: 'provider-electrician',
    serviceId: 'electrician',
    rating: 4.9,
    reviewCount: 326,
    experience: '8 yrs',
    availability: '24/7',
    distance: '1.5 km',
    aboutKey: 'serviceElectricianAbout',
    servicesOfferedKeys: ['serviceOfferedWiring', 'serviceOfferedSwitchboard', 'serviceOfferedFanLight', 'serviceOfferedInverterUps'],
    provider: { name: 'Ravi Electrical Works', locationKey: 'locationKamareddyRoad', initial: 'R', phone: '9876512345', whatsapp: '9876512345' },
  },
  {
    id: 'provider-plumber',
    serviceId: 'plumber',
    rating: 4.7,
    reviewCount: 189,
    experience: '5 yrs',
    availability: '7 AM–9 PM',
    distance: '2 km',
    aboutKey: 'servicePlumberAbout',
    servicesOfferedKeys: ['serviceOfferedLeakFixing', 'serviceOfferedTapFittings', 'serviceOfferedBathroomPlumbing', 'serviceOfferedWaterTank'],
    provider: { name: 'Krishna Plumbing Services', locationKey: 'locationBodhanRoad', initial: 'K', phone: '9876523456', whatsapp: '9876523456' },
  },
  {
    id: 'provider-painting',
    serviceId: 'painting',
    rating: 4.5,
    reviewCount: 94,
    experience: '7 yrs',
    availability: '9 AM–6 PM',
    distance: '4 km',
    aboutKey: 'servicePaintingAbout',
    servicesOfferedKeys: ['serviceOfferedInteriorPainting', 'serviceOfferedExteriorPainting', 'serviceOfferedTextureWork', 'serviceOfferedWaterproofing'],
    provider: { name: 'ColorCraft Painters', locationKey: 'locationDichpally', initial: 'C', phone: '9876534567', whatsapp: '9876534567' },
  },
  {
    id: 'provider-legal-docs',
    serviceId: 'legal-docs',
    rating: 4.8,
    reviewCount: 67,
    experience: '10 yrs',
    availability: '10 AM–6 PM',
    distance: '5 km',
    aboutKey: 'serviceLegalDocsAbout',
    servicesOfferedKeys: ['serviceOfferedRegistration', 'serviceOfferedSaleAgreement', 'serviceOfferedEncumbrance', 'serviceOfferedMutation'],
    provider: { name: 'Nizamabad Legal Desk', locationKey: 'locationCivilLines', initial: 'N', phone: '9876545678', whatsapp: '9876545678' },
  },
]

for (const [index, provider] of serviceProviders.entries()) {
  await createDoc('serviceProviders', provider.id, {
    serviceId: str(provider.serviceId),
    rating: num(provider.rating),
    reviewCount: num(provider.reviewCount),
    experience: str(provider.experience),
    availability: str(provider.availability),
    distance: str(provider.distance),
    aboutKey: str(provider.aboutKey),
    servicesOfferedKeys: arr(provider.servicesOfferedKeys.map((key) => str(key))),
    provider: map({
      name: str(provider.provider.name),
      locationKey: str(provider.provider.locationKey),
      initial: str(provider.provider.initial),
      phone: str(provider.provider.phone),
      whatsapp: str(provider.provider.whatsapp),
    }),
    sortOrder: num(index),
    status: str('active'),
    createdAt: ts(now),
    updatedAt: ts(now),
  })
}

console.log('Created collections and documents:')
console.log('  profiles/' + demoUserId)
console.log('  publicProfiles/' + demoUserId)
console.log('  listings/' + demoListingId)
console.log('  listings/demo-listing-rent')
console.log('  conversations/' + demoConversationId)
console.log('  tickets/' + demoTicketId)
console.log('  serviceCategories/ (6 categories)')
console.log('  serviceProviders/ (6 providers)')
console.log('')
console.log('Open Firebase Console:')
console.log(`  https://console.firebase.google.com/project/${projectId}/firestore/databases/-default-/data`)
