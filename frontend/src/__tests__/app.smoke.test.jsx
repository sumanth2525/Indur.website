import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { translations } from '../i18n/translations'

const {
  authUser,
  guestUser,
  mockConversation,
  mockListing,
  mockListings,
  mockPublicSeller,
  mockServiceConversation,
} = vi.hoisted(() => {
  const listing = {
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

  const user = {
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

  const guest = {
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

  const seller = {
    id: 'seller-1',
    name: 'Ravi Seller',
    photoURL: '',
    contactPhone: '9876543210',
  }

  const conversation = {
    id: 'conv-smoke-1',
    entityType: 'property',
    propertyId: listing.id,
    buyerId: user.id,
    sellerId: 'seller-1',
    messages: [
      {
        id: 'msg-1',
        senderId: user.id,
        text: 'Is this still available?',
        timestamp: new Date().toISOString(),
      },
    ],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }

  const serviceConversation = {
    id: 'conv-service-1',
    entityType: 'service',
    serviceId: 'electrician',
    providerDocId: 'electrician-primary',
    serviceTitleKey: 'serviceElectrician',
    providerName: 'Ravi Electrical Works',
    buyerId: user.id,
    sellerId: 'svc_electrician-primary',
    messages: [],
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }

  return {
    authUser: user,
    guestUser: guest,
    mockListing: listing,
    mockListings: [listing],
    mockPublicSeller: seller,
    mockConversation: conversation,
    mockServiceConversation: serviceConversation,
  }
})

vi.mock('@vercel/analytics/react', () => ({
  Analytics: () => null,
}))

vi.mock('../services/analytics', () => ({
  trackPageView: vi.fn(),
  trackPropertyView: vi.fn(),
  trackPropertyClick: vi.fn(),
  trackContactSeller: vi.fn(),
  trackSaveProperty: vi.fn(),
}))

vi.mock('../services/geolocation', () => ({
  detectUserLocation: vi.fn().mockResolvedValue({
    scope: 'district',
    label: 'Nizamabad District',
    mandal: null,
    village: null,
    division: null,
  }),
}))

vi.mock('../services/dataApi', () => ({
  watchListings: vi.fn((onListings) => {
    onListings([
      {
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
      },
    ])
    return vi.fn()
  }),
  fetchListings: vi.fn().mockResolvedValue([
    {
      id: 'prop-smoke-1',
      type: 'apartment',
      purpose: 'sell',
      title: '2 BHK Near Kanteshwar',
      price: 4500000,
      location: { area: 'Kanteshwar', city: 'Nizamabad' },
      images: [],
      sellerId: 'seller-1',
      status: 'active',
      sqft: 950,
      bedrooms: 2,
      facing: 'East',
      readyToMove: true,
      views: 12,
      createdAt: new Date().toISOString(),
    },
  ]),
  fetchListingById: vi.fn(async (id) => {
    if (id !== 'prop-smoke-1') return null
    return {
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
      createdAt: new Date().toISOString(),
    }
  }),
  fetchSellerListings: vi.fn().mockResolvedValue([]),
  fetchPublicProfileById: vi.fn().mockResolvedValue(mockPublicSeller),
  patchProfile: vi.fn().mockResolvedValue(authUser),
  toggleSavedListing: vi.fn().mockResolvedValue(true),
  bumpListingViews: vi.fn().mockResolvedValue(undefined),
  fetchServiceCategories: vi.fn().mockRejectedValue(new Error('offline')),
  fetchServiceCategory: vi.fn().mockResolvedValue(null),
  fetchServiceProviders: vi.fn().mockResolvedValue([]),
  fetchPrimaryServiceProvider: vi.fn().mockResolvedValue(null),
  watchConversations: vi.fn((userId, onConversations) => {
    onConversations([mockConversation])
    return vi.fn()
  }),
  watchConversation: vi.fn((id, onConversation) => {
    const conv = id === mockServiceConversation.id ? mockServiceConversation : mockConversation
    onConversation(conv)
    return vi.fn()
  }),
  getOrCreateConversation: vi.fn().mockResolvedValue(mockConversation),
  getOrCreateServiceConversation: vi.fn().mockResolvedValue(mockServiceConversation),
  sendMessage: vi.fn().mockResolvedValue({ id: 'msg-new' }),
  createSupportTicket: vi.fn().mockResolvedValue({ id: 'ticket-1' }),
  createListing: vi.fn(),
  updateListingRecord: vi.fn(),
  removeListing: vi.fn(),
  fetchProfileById: vi.fn().mockResolvedValue(authUser),
}))

import { renderApp } from '../test/renderApp'
import { getOrCreateServiceConversation } from '../services/dataApi'

const t = translations.en

function getBottomNav() {
  return screen.getAllByRole('navigation').find((nav) => nav.className.includes('fixed')) ?? screen.getAllByRole('navigation')[0]
}

describe('App smoke flows', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.open = vi.fn()
  })

  describe('Login and entry routes', () => {
    it('shows login screen and switches between property and local services modes', async () => {
      const user = userEvent.setup()
      renderApp({ route: '/', authUser: null })

      expect(screen.getByRole('heading', { name: t.tagline })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: t.buySellRent })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: t.localServices })).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: t.localServices }))
      expect(screen.getByRole('button', { name: t.localServices })).toHaveClass('text-white')
    })

    it('continues as guest from login to browse feed', async () => {
      const user = userEvent.setup()
      renderApp({ route: '/', authUser: null })

      await user.click(screen.getByRole('button', { name: /continue as guest/i }))

      await waitFor(() => {
        expect(screen.getAllByRole('tab', { name: /^buy$/i }).length).toBeGreaterThan(0)
      })
    })

    it('continues as guest from local services mode to services feed', async () => {
      const user = userEvent.setup()
      renderApp({ route: '/', authUser: null })

      await user.click(screen.getByRole('button', { name: t.localServices }))
      await user.click(screen.getByRole('button', { name: /continue as guest/i }))

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: t.localServices })).toBeInTheDocument()
        expect(screen.getByText(t.serviceElectrician)).toBeInTheDocument()
      })
    })
  })

  describe('Property browse flow', () => {
    it('shows listings on browse and opens property detail', async () => {
      const user = userEvent.setup()
      renderApp({ route: '/browse' })

      await waitFor(() => {
        expect(screen.getAllByText(/₹45,00,000|45,00,000/).length).toBeGreaterThan(0)
      })

      const listingLinks = screen.getAllByRole('link').filter((link) => link.getAttribute('href') === '/property/prop-smoke-1')
      await user.click(listingLinks[0])

      await waitFor(() => {
        expect(screen.getByText(t.contactSeller)).toBeInTheDocument()
      })
    })

    it('returns from property detail to browse using back button', async () => {
      const user = userEvent.setup()
      renderApp({
        initialEntries: ['/browse', `/property/${mockListing.id}`],
        initialIndex: 1,
      })

      await waitFor(() => {
        expect(screen.getByText(t.contactSeller)).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: new RegExp(t.back, 'i') }))

      await waitFor(() => {
        expect(screen.getAllByText(/₹45,00,000|45,00,000/).length).toBeGreaterThan(0)
      })
    })
  })

  describe('Local services flow', () => {
    it('shows service categories on /services', async () => {
      renderApp({ route: '/services' })

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: t.localServices })).toBeInTheDocument()
        expect(screen.getByText(t.servicePlumber)).toBeInTheDocument()
        expect(screen.getByText(t.serviceElectrician)).toBeInTheDocument()
      })
    })

    it('opens service detail from list and returns back', async () => {
      const user = userEvent.setup()
      renderApp({
        initialEntries: ['/services', '/services/electrician'],
        initialIndex: 1,
      })

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: t.serviceDetails })).toBeInTheDocument()
        expect(screen.getByText(t.serviceElectrician)).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: t.back }))

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: t.localServices })).toBeInTheDocument()
      })
    })

    it('navigates from services list into service detail via card click', async () => {
      const user = userEvent.setup()
      renderApp({ route: '/services' })

      await waitFor(() => {
        expect(screen.getByText(t.serviceElectrician)).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: new RegExp(t.serviceElectrician) }))

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: t.serviceDetails })).toBeInTheDocument()
      })
    })

    it('service detail contact buttons work (WhatsApp and message)', async () => {
      const user = userEvent.setup()
      renderApp({ route: '/services/electrician' })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: t.message })).toBeInTheDocument()
      })

      await user.click(screen.getByLabelText(t.contactWhatsApp))
      expect(window.open).toHaveBeenCalled()

      await user.click(screen.getByRole('button', { name: t.message }))
      await waitFor(() => {
        expect(getOrCreateServiceConversation).toHaveBeenCalled()
        expect(screen.getByPlaceholderText(t.typeMessage)).toBeInTheDocument()
      })
    })

    it('switches between multiple providers on service detail', async () => {
      const user = userEvent.setup()
      renderApp({ route: '/services/electrician' })

      await waitFor(() => {
        expect(screen.getByText(t.chooseProvider)).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /Metro Electric Services/i }))

      expect(screen.getAllByText(/Metro Electric Services/i).length).toBeGreaterThan(0)
    })
  })

  describe('Bottom navigation', () => {
    it('browse bottom nav moves between home and profile', async () => {
      const user = userEvent.setup()
      renderApp({ route: '/browse' })

      const nav = getBottomNav()

      await user.click(within(nav).getByRole('link', { name: /^profile$/i }))
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: t.profile })).toBeInTheDocument()
      })

      await user.click(within(nav).getByRole('link', { name: /^home$/i }))
      await waitFor(() => {
        expect(screen.getAllByText(/₹45,00,000|45,00,000/).length).toBeGreaterThan(0)
      })
    })

    it('services bottom nav opens messages and profile from services home', async () => {
      const user = userEvent.setup()
      renderApp({ route: '/services' })

      const nav = getBottomNav()

      await user.click(within(nav).getByRole('link', { name: /^messages$/i }))
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: t.messages })).toBeInTheDocument()
      })

      await user.click(within(getBottomNav()).getByRole('link', { name: /^profile$/i }))
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: t.profile })).toBeInTheDocument()
      })
    })
  })

  describe('Profile and support screens', () => {
    it('profile menu opens edit profile and returns via back', async () => {
      const user = userEvent.setup()
      renderApp({ route: '/profile' })

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: t.profile })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('link', { name: t.editProfile }))

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: t.editProfile })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: t.back }))
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: t.profile })).toBeInTheDocument()
      })
    })

    it('support screen toggles FAQ and opens ticket form', async () => {
      const user = userEvent.setup()
      renderApp({ route: '/support' })

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: t.helpTitle })).toBeInTheDocument()
      })

      const faqContainer = screen.getByText(t.faq1Q).closest('.rounded-2xl')
      const faqButtons = within(faqContainer).getAllByRole('button')
      await user.click(faqButtons[0])
      expect(screen.queryByText(t.faq1A)).not.toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: /raise a ticket|raise ticket/i }))
      expect(screen.getByPlaceholderText(/subject/i)).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: t.back }))
      expect(screen.queryByPlaceholderText(/subject/i)).not.toBeInTheDocument()
    })

    it('notifications bell on services opens notifications screen', async () => {
      const user = userEvent.setup()
      renderApp({ route: '/services' })

      await waitFor(() => {
        expect(screen.getByLabelText(t.notifications)).toBeInTheDocument()
      })

      await user.click(screen.getByLabelText(t.notifications))

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: t.notifications })).toBeInTheDocument()
      })
    })

    it('notifications back button leaves notifications screen', async () => {
      const user = userEvent.setup()
      renderApp({
        initialEntries: ['/services', '/profile/notifications'],
        initialIndex: 1,
      })

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: t.notifications })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: t.back }))
      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: t.notifications })).not.toBeInTheDocument()
      })
    })
  })

  describe('Auth-gated routes', () => {
    it('redirects guest from messages to login', async () => {
      renderApp({ route: '/messages', authUser: guestUser })

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: t.tagline })).toBeInTheDocument()
      })
    })

    it('redirects guest from post ad to login', async () => {
      renderApp({ route: '/post', authUser: guestUser })

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: t.tagline })).toBeInTheDocument()
      })
    })
  })

  describe('Messages flow', () => {
    it('opens a conversation thread and returns to inbox', async () => {
      const user = userEvent.setup()
      renderApp({ route: '/messages' })

      await waitFor(() => {
        expect(screen.getByText(mockPublicSeller.name)).toBeInTheDocument()
      })

      await user.click(screen.getByRole('link', { name: new RegExp(mockPublicSeller.name) }))

      await waitFor(() => {
        expect(screen.getByText('Is this still available?')).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: t.back }))
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: t.messages })).toBeInTheDocument()
      })
    })
  })
})
