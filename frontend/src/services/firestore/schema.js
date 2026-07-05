export const COLLECTIONS = {
  profiles: 'profiles',
  publicProfiles: 'publicProfiles',
  listings: 'listings',
  conversations: 'conversations',
  tickets: 'tickets',
  serviceCategories: 'serviceCategories',
  serviceProviders: 'serviceProviders',
  otpRateLimits: 'otpRateLimits',
  otpDeviceLimits: 'otpDeviceLimits',
}

function timestampToIso(value) {
  if (!value) return new Date().toISOString()
  if (typeof value === 'string') return value
  if (value.toDate) return value.toDate().toISOString()
  return new Date().toISOString()
}

export function docToProfile(id, data) {
  return {
    id,
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    photoURL: data.photoURL || '',
    location: data.location || 'Nizamabad',
    browseLocation: data.browseLocation || null,
    saved: data.saved || [],
    views: data.views || 0,
    authProvider: data.authProvider || 'firebase',
    lang: data.lang === 'te' ? 'te' : 'en',
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
  }
}

export function docToListing(id, data) {
  return {
    id,
    type: data.type,
    purpose: data.purpose || 'sell',
    title: data.title,
    description: data.description || '',
    price: data.price,
    location: data.location || { area: '', city: 'Nizamabad', lat: 0, lng: 0 },
    images: data.images || [],
    sellerId: data.sellerId,
    status: data.status || 'active',
    sqft: data.sqft || 0,
    acres: data.acres,
    bedrooms: data.bedrooms || 0,
    facing: data.facing || '',
    readyToMove: Boolean(data.readyToMove),
    views: data.views || 0,
    saveCount: data.saveCount || 0,
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
  }
}

export function docToConversation(id, data) {
  return {
    id,
    entityType: data.entityType || (data.serviceId ? 'service' : 'property'),
    propertyId: data.propertyId || null,
    serviceId: data.serviceId || null,
    providerDocId: data.providerDocId || null,
    serviceTitleKey: data.serviceTitleKey || null,
    providerName: data.providerName || null,
    buyerId: data.buyerId,
    sellerId: data.sellerId,
    messages: (data.messages || []).map((m) => ({
      id: m.id,
      senderId: m.senderId,
      text: m.text,
      timestamp: timestampToIso(m.timestamp),
    })),
    updatedAt: timestampToIso(data.updatedAt),
    createdAt: timestampToIso(data.createdAt),
  }
}

export function docToTicket(id, data) {
  return {
    id,
    userId: data.userId,
    subject: data.subject,
    message: data.message,
    status: data.status || 'open',
    createdAt: timestampToIso(data.createdAt),
  }
}

export function profileToFirestore(profile) {
  const data = {
    name: profile.name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    photoURL: profile.photoURL || '',
    location: profile.location || 'Nizamabad',
    saved: profile.saved || [],
    views: profile.views || 0,
    authProvider: profile.authProvider || 'firebase',
    lang: profile.lang === 'te' ? 'te' : 'en',
  }
  if (profile.browseLocation) data.browseLocation = profile.browseLocation
  return data
}

export function docToServiceCategory(id, data) {
  return {
    id,
    titleKey: data.titleKey || '',
    subtitleKey: data.subtitleKey || '',
    color: data.color || 'teal',
    icon: data.icon || '',
    sortOrder: data.sortOrder ?? 0,
    status: data.status || 'active',
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
  }
}

export function docToServiceProvider(id, data) {
  const provider = data.provider || {}
  return {
    id,
    serviceId: data.serviceId || '',
    rating: data.rating ?? 0,
    reviewCount: data.reviewCount ?? 0,
    experience: data.experience || '',
    availability: data.availability || '',
    availableNow: Boolean(data.availableNow),
    distance: data.distance || '',
    startingPrice: data.startingPrice ?? null,
    priceUnitKey: data.priceUnitKey || 'priceUnitVisit',
    verified: Boolean(data.verified),
    areas: data.areas || [],
    aboutKey: data.aboutKey || '',
    servicesOfferedKeys: data.servicesOfferedKeys || [],
    providerUserId: data.providerUserId || null,
    provider: {
      name: provider.name || '',
      locationKey: provider.locationKey || '',
      initial: provider.initial || '',
      phone: provider.phone || '',
      whatsapp: provider.whatsapp || provider.phone || '',
    },
    sortOrder: data.sortOrder ?? 0,
    status: data.status || 'active',
    createdAt: timestampToIso(data.createdAt),
    updatedAt: timestampToIso(data.updatedAt),
  }
}

export function listingToFirestore(listing) {
  const data = {
    type: listing.type,
    purpose: listing.purpose || 'sell',
    title: listing.title,
    description: listing.description || '',
    price: Number(listing.price),
    location: listing.location,
    images: listing.images || [],
    sellerId: listing.sellerId,
    status: listing.status || 'active',
    sqft: Number(listing.sqft || 0),
    bedrooms: Number(listing.bedrooms || 0),
    facing: listing.facing || '',
    readyToMove: Boolean(listing.readyToMove),
    views: Number(listing.views || 0),
    saveCount: Number(listing.saveCount || 0),
  }
  if (listing.acres != null) data.acres = Number(listing.acres)
  return data
}
