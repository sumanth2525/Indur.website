export const mockListing = {
  id: 'prop-smoke-1',
  type: 'apartment',
  purpose: 'sell',
  title: '2 BHK Near Kanteshwar',
  description: 'Spacious apartment with parking.',
  price: 4500000,
  location: { area: 'Kanteshwar', city: 'Nizamabad', lat: 0, lng: 0 },
  images: [],
  sellerId: 'seller-1',
  status: 'active',
  sqft: 950,
  bedrooms: 2,
  facing: 'East',
  readyToMove: true,
  views: 12,
  saveCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const mockListings = [mockListing]

export const mockPublicSeller = {
  id: 'seller-1',
  name: 'Ravi Seller',
  photoURL: '',
  contactPhone: '9876543210',
}

export const mockConversation = {
  id: 'conv-smoke-1',
  entityType: 'property',
  propertyId: mockListing.id,
  buyerId: 'user-smoke-1',
  sellerId: 'seller-1',
  messages: [
    {
      id: 'msg-1',
      senderId: 'user-smoke-1',
      text: 'Is this still available?',
      timestamp: new Date().toISOString(),
    },
  ],
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
}

export const mockServiceConversation = {
  id: 'conv-service-1',
  entityType: 'service',
  serviceId: 'electrician',
  providerDocId: 'electrician-primary',
  serviceTitleKey: 'serviceElectrician',
  providerName: 'Ravi Electrical Works',
  buyerId: 'user-smoke-1',
  sellerId: 'svc_electrician-primary',
  messages: [],
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
}

export const authUser = {
  id: 'user-smoke-1',
  name: 'Smoke Tester',
  email: 'smoke@test.com',
  phone: '9876543210',
  photoURL: '',
  location: 'Nizamabad',
  saved: [],
  views: 0,
  authProvider: 'google',
  lang: 'en',
  isGuest: false,
}

export const guestUser = {
  id: null,
  isGuest: true,
  name: 'Guest',
  email: '',
  phone: '',
  photoURL: '',
  authProvider: 'guest',
  lang: 'en',
  location: 'Nizamabad',
  saved: [],
  views: 0,
}
