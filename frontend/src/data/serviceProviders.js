export const SERVICE_PROVIDERS = {
  'packers-movers': {
    id: 'packers-movers-primary',
    serviceId: 'packers-movers',
    rating: 4.8,
    reviewCount: 212,
    experience: '6 yrs',
    availability: '24/7',
    availableNow: true,
    distance: '3 km',
    startingPrice: 3500,
    priceUnitKey: 'priceUnitVisit',
    verified: true,
    areas: ['Nizamabad', 'Kanteshwar', 'Armoor Road'],
    aboutKey: 'servicePackersMoversAbout',
    servicesOfferedKeys: [
      'serviceOfferedHouseShifting',
      'serviceOfferedOfficeRelocation',
      'serviceOfferedPackingMaterial',
      'serviceOfferedLoadingUnloading',
    ],
    provider: {
      name: 'Sai Movers & Packers',
      locationKey: 'locationKanteshwar',
      initial: 'S',
      phone: '9876543210',
      whatsapp: '9876543210',
    },
    sortOrder: 0,
  },
  'home-cleaning': {
    id: 'home-cleaning-primary',
    serviceId: 'home-cleaning',
    rating: 4.6,
    reviewCount: 148,
    experience: '4 yrs',
    availability: '8 AM–8 PM',
    availableNow: true,
    distance: '2 km',
    startingPrice: 799,
    priceUnitKey: 'priceUnitSession',
    verified: true,
    areas: ['Nizamabad', 'Armoor Road', 'Civil Lines'],
    aboutKey: 'serviceHomeCleaningAbout',
    servicesOfferedKeys: [
      'serviceOfferedDeepCleaning',
      'serviceOfferedBathroomCleaning',
      'serviceOfferedKitchenCleaning',
      'serviceOfferedSofaCarpet',
    ],
    provider: {
      name: 'Sparkle Home Services',
      locationKey: 'locationArmoorRoad',
      initial: 'S',
      phone: '9876501234',
      whatsapp: '9876501234',
    },
    sortOrder: 0,
  },
  electrician: {
    id: 'electrician-primary',
    serviceId: 'electrician',
    rating: 4.9,
    reviewCount: 326,
    experience: '8 yrs',
    availability: '24/7',
    availableNow: true,
    distance: '1.5 km',
    startingPrice: 199,
    priceUnitKey: 'priceUnitVisit',
    verified: true,
    areas: ['Nizamabad', 'Kamareddy Road', 'Bodhan Road'],
    aboutKey: 'serviceElectricianAbout',
    servicesOfferedKeys: [
      'serviceOfferedWiring',
      'serviceOfferedSwitchboard',
      'serviceOfferedFanLight',
      'serviceOfferedInverterUps',
    ],
    provider: {
      name: 'Ravi Electrical Works',
      locationKey: 'locationKamareddyRoad',
      initial: 'R',
      phone: '9876512345',
      whatsapp: '9876512345',
    },
    sortOrder: 0,
  },
  plumber: {
    id: 'plumber-primary',
    serviceId: 'plumber',
    rating: 4.7,
    reviewCount: 189,
    experience: '5 yrs',
    availability: '7 AM–9 PM',
    availableNow: true,
    distance: '2 km',
    startingPrice: 249,
    priceUnitKey: 'priceUnitVisit',
    verified: true,
    areas: ['Nizamabad', 'Bodhan Road', 'Dichpally'],
    aboutKey: 'servicePlumberAbout',
    servicesOfferedKeys: [
      'serviceOfferedLeakFixing',
      'serviceOfferedTapFittings',
      'serviceOfferedBathroomPlumbing',
      'serviceOfferedWaterTank',
    ],
    provider: {
      name: 'Krishna Plumbing Services',
      locationKey: 'locationBodhanRoad',
      initial: 'K',
      phone: '9876523456',
      whatsapp: '9876523456',
    },
    sortOrder: 0,
  },
  painting: {
    id: 'painting-primary',
    serviceId: 'painting',
    rating: 4.5,
    reviewCount: 94,
    experience: '7 yrs',
    availability: '9 AM–6 PM',
    availableNow: false,
    distance: '4 km',
    startingPrice: 12,
    priceUnitKey: 'priceUnitSqft',
    verified: false,
    areas: ['Nizamabad', 'Dichpally'],
    aboutKey: 'servicePaintingAbout',
    servicesOfferedKeys: [
      'serviceOfferedInteriorPainting',
      'serviceOfferedExteriorPainting',
      'serviceOfferedTextureWork',
      'serviceOfferedWaterproofing',
    ],
    provider: {
      name: 'ColorCraft Painters',
      locationKey: 'locationDichpally',
      initial: 'C',
      phone: '9876534567',
      whatsapp: '9876534567',
    },
    sortOrder: 0,
  },
  'legal-docs': {
    id: 'legal-docs-primary',
    serviceId: 'legal-docs',
    rating: 4.8,
    reviewCount: 67,
    experience: '10 yrs',
    availability: '10 AM–6 PM',
    availableNow: false,
    distance: '5 km',
    startingPrice: 1500,
    priceUnitKey: 'priceUnitCase',
    verified: true,
    areas: ['Nizamabad', 'Civil Lines'],
    aboutKey: 'serviceLegalDocsAbout',
    servicesOfferedKeys: [
      'serviceOfferedRegistration',
      'serviceOfferedSaleAgreement',
      'serviceOfferedEncumbrance',
      'serviceOfferedMutation',
    ],
    provider: {
      name: 'Nizamabad Legal Desk',
      locationKey: 'locationCivilLines',
      initial: 'N',
      phone: '9876545678',
      whatsapp: '9876545678',
    },
    sortOrder: 0,
  },
}

export const SECONDARY_SERVICE_PROVIDERS = {
  electrician: [
    {
      id: 'electrician-secondary',
      serviceId: 'electrician',
      rating: 4.6,
      reviewCount: 112,
      experience: '5 yrs',
      availability: '8 AM–10 PM',
      availableNow: true,
      distance: '4 km',
      startingPrice: 179,
      priceUnitKey: 'priceUnitVisit',
      verified: false,
      areas: ['Nizamabad', 'Armoor Road'],
      aboutKey: 'serviceElectricianAbout',
      servicesOfferedKeys: ['serviceOfferedWiring', 'serviceOfferedFanLight'],
      provider: {
        name: 'Metro Electric Services',
        locationKey: 'locationArmoorRoad',
        initial: 'M',
        phone: '9876598765',
        whatsapp: '9876598765',
      },
      sortOrder: 1,
    },
  ],
  plumber: [
    {
      id: 'plumber-secondary',
      serviceId: 'plumber',
      rating: 4.4,
      reviewCount: 76,
      experience: '3 yrs',
      availability: '24/7',
      availableNow: true,
      distance: '3 km',
      startingPrice: 199,
      priceUnitKey: 'priceUnitVisit',
      verified: false,
      areas: ['Nizamabad', 'Kamareddy Road'],
      aboutKey: 'servicePlumberAbout',
      servicesOfferedKeys: ['serviceOfferedLeakFixing', 'serviceOfferedTapFittings'],
      provider: {
        name: 'QuickFix Plumbing',
        locationKey: 'locationKamareddyRoad',
        initial: 'Q',
        phone: '9876587654',
        whatsapp: '9876587654',
      },
      sortOrder: 1,
    },
  ],
}

export function getServiceProvider(id) {
  return SERVICE_PROVIDERS[id] ?? null
}

export function getStaticProvidersForService(serviceId) {
  const primary = SERVICE_PROVIDERS[serviceId]
  const secondary = SECONDARY_SERVICE_PROVIDERS[serviceId] || []
  return [primary, ...secondary].filter(Boolean)
}

function normalizeWhatsAppNumber(value) {
  const digits = String(value || '').replace(/\D/g, '')
  if (!digits) return ''
  if (digits.length === 10 && /^[6-9]/.test(digits)) return `91${digits}`
  return digits
}

export function getProviderWhatsAppUrl(phone, message) {
  const normalized = normalizeWhatsAppNumber(phone)
  if (!normalized) return null
  const base = `https://wa.me/${normalized}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

export function formatServicePrice(price, unitLabel) {
  if (price == null) return null
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price)
  return unitLabel ? `${formatted}${unitLabel}` : formatted
}
