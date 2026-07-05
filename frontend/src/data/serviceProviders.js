export const SERVICE_PROVIDERS = {
  'packers-movers': {
    serviceId: 'packers-movers',
    rating: 4.8,
    reviewCount: 212,
    experience: '6 yrs',
    availability: '24/7',
    distance: '3 km',
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
  },
  'home-cleaning': {
    serviceId: 'home-cleaning',
    rating: 4.6,
    reviewCount: 148,
    experience: '4 yrs',
    availability: '8 AM–8 PM',
    distance: '2 km',
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
  },
  electrician: {
    serviceId: 'electrician',
    rating: 4.9,
    reviewCount: 326,
    experience: '8 yrs',
    availability: '24/7',
    distance: '1.5 km',
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
  },
  plumber: {
    serviceId: 'plumber',
    rating: 4.7,
    reviewCount: 189,
    experience: '5 yrs',
    availability: '7 AM–9 PM',
    distance: '2 km',
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
  },
  painting: {
    serviceId: 'painting',
    rating: 4.5,
    reviewCount: 94,
    experience: '7 yrs',
    availability: '9 AM–6 PM',
    distance: '4 km',
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
  },
  'legal-docs': {
    serviceId: 'legal-docs',
    rating: 4.8,
    reviewCount: 67,
    experience: '10 yrs',
    availability: '10 AM–6 PM',
    distance: '5 km',
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
  },
}

export function getServiceProvider(id) {
  return SERVICE_PROVIDERS[id] ?? null
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
