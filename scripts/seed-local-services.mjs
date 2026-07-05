/**
 * Seeds serviceCategories and serviceProviders collections only.
 * Uses PATCH so it is safe to re-run.
 *
 * Run: node seed-local-services.mjs
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

function ts(date = new Date()) {
  return { timestampValue: date.toISOString() }
}

function map(fields) {
  return { mapValue: { fields } }
}

function arr(values) {
  return { arrayValue: { values } }
}

async function upsertDoc(collection, documentId, fields) {
  const createUrl = `${baseUrl}/${collection}?documentId=${encodeURIComponent(documentId)}`
  const patchUrl = `${baseUrl}/${collection}/${encodeURIComponent(documentId)}`

  const createRes = await fetch(createUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  })

  if (createRes.ok) return createRes.json()

  if (createRes.status !== 409) {
    const body = await createRes.text()
    throw new Error(`Failed ${collection}/${documentId}: ${createRes.status} ${body}`)
  }

  const patchRes = await fetch(`${patchUrl}?updateMask.fieldPaths=${Object.keys(fields).join('&updateMask.fieldPaths=')}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields }),
  })
  const body = await patchRes.text()
  if (!patchRes.ok) {
    throw new Error(`Failed ${collection}/${documentId}: ${patchRes.status} ${body}`)
  }
  return JSON.parse(body)
}

const token = getAccessToken()
const now = new Date()

const serviceCategories = [
  { id: 'packers-movers', titleKey: 'servicePackersMovers', subtitleKey: 'servicePackersMoversSub', color: 'teal', sortOrder: 0 },
  { id: 'home-cleaning', titleKey: 'serviceHomeCleaning', subtitleKey: 'serviceHomeCleaningSub', color: 'blue', sortOrder: 1 },
  { id: 'electrician', titleKey: 'serviceElectrician', subtitleKey: 'serviceElectricianSub', color: 'amber', sortOrder: 2 },
  { id: 'plumber', titleKey: 'servicePlumber', subtitleKey: 'servicePlumberSub', color: 'teal', sortOrder: 3 },
  { id: 'painting', titleKey: 'servicePainting', subtitleKey: 'servicePaintingSub', color: 'blue', sortOrder: 4 },
  { id: 'legal-docs', titleKey: 'serviceLegalDocs', subtitleKey: 'serviceLegalDocsSub', color: 'amber', sortOrder: 5 },
]

console.log(`Seeding local services in project: ${projectId}\n`)

for (const category of serviceCategories) {
  await upsertDoc('serviceCategories', category.id, {
    titleKey: str(category.titleKey),
    subtitleKey: str(category.subtitleKey),
    color: str(category.color),
    sortOrder: num(category.sortOrder),
    status: str('active'),
    createdAt: ts(now),
    updatedAt: ts(now),
  })
  console.log(`  serviceCategories/${category.id}`)
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
  await upsertDoc('serviceProviders', provider.id, {
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
  console.log(`  serviceProviders/${provider.id}`)
}

console.log('\nDone. Open Firestore:')
console.log(`  https://console.firebase.google.com/project/${projectId}/firestore/databases/-default-/data`)
