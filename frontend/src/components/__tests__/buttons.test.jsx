import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PurposeToggle from '../PurposeToggle'
import LanguageToggle from '../LanguageToggle'
import LocationPicker from '../LocationPicker'
import PropertyListItem from '../PropertyListItem'
import Support from '../../pages/Support'
import Profile from '../../pages/Profile'
import Login from '../../pages/Login'
import { renderWithProviders } from '../../test/renderWithProviders'
import { DEFAULT_LOCATION } from '../../data/nizamabadLocations'
import { translations } from '../../i18n/translations'

vi.mock('../../services/dataApi', () => ({
  createSupportTicket: vi.fn().mockResolvedValue({ id: 'ticket-1' }),
  fetchSellerListings: vi.fn().mockResolvedValue([]),
  patchProfile: vi.fn().mockResolvedValue({ id: 'user-1', lang: 'te' }),
}))

vi.mock('../../services/geolocation', () => ({
  detectUserLocation: vi.fn().mockResolvedValue({
    scope: 'district',
    label: 'Nizamabad District',
    mandal: null,
    village: null,
  }),
}))

vi.mock('../../services/analytics', () => ({
  trackPropertyClick: vi.fn(),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const sampleProperty = {
  id: 'prop-1',
  title: '2 BHK Apartment',
  price: 4500000,
  purpose: 'sell',
  category: 'apartment',
  location: { area: 'Kanteshwar', city: 'Nizamabad' },
  createdAt: new Date().toISOString(),
  images: [],
}

describe('Button interactions', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
  })

  describe('PurposeToggle', () => {
    it('calls onChange when Buy or Rent is clicked', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      renderWithProviders(<PurposeToggle value="buy" onChange={onChange} />)

      await user.click(screen.getByRole('tab', { name: 'For Rent' }))
      expect(onChange).toHaveBeenCalledWith('rent')

      await user.click(screen.getByRole('tab', { name: 'Buy' }))
      expect(onChange).toHaveBeenCalledWith('buy')
    })

    it('calls onSell instead of onChange when Sell is clicked in browse mode', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()
      const onSell = vi.fn()

      renderWithProviders(
        <PurposeToggle value="buy" onChange={onChange} onSell={onSell} />,
      )

      await user.click(screen.getByRole('tab', { name: 'Sell' }))
      expect(onSell).toHaveBeenCalledTimes(1)
      expect(onChange).not.toHaveBeenCalled()
    })
  })

  describe('LanguageToggle', () => {
    it('switches language label when clicked', async () => {
      const user = userEvent.setup()

      renderWithProviders(<LanguageToggle />)

      const button = screen.getByRole('button', { name: /toggle language/i })
      expect(button).toHaveTextContent('తెలుగు')

      await user.click(button)
      expect(button).toHaveTextContent('English')

      await user.click(button)
      expect(button).toHaveTextContent('తెలుగు')
    })
  })

  describe('LocationPicker', () => {
    it('opens modal, selects district, and closes', async () => {
      const user = userEvent.setup()
      const onChange = vi.fn()

      renderWithProviders(
        <LocationPicker value={DEFAULT_LOCATION} onChange={onChange} />,
      )

      await user.click(screen.getByRole('button', { name: /select location/i }))
      expect(screen.getByRole('heading', { name: /select location/i })).toBeInTheDocument()

      const districtButton = screen.getByRole('button', { name: /all district/i })
      await user.click(districtButton)
      expect(onChange).toHaveBeenCalled()
      expect(screen.queryByRole('heading', { name: /select location/i })).not.toBeInTheDocument()
    })

    it('closes modal when backdrop is clicked', async () => {
      const user = userEvent.setup()

      renderWithProviders(
        <LocationPicker value={DEFAULT_LOCATION} onChange={vi.fn()} />,
      )

      await user.click(screen.getByRole('button', { name: /select location/i }))
      const dialog = screen.getByRole('heading', { name: /select location/i }).closest('div').parentElement
      const backdrop = dialog?.previousElementSibling
      expect(backdrop).toBeTruthy()
      await user.click(backdrop)
      expect(screen.queryByRole('heading', { name: /select location/i })).not.toBeInTheDocument()
    })
  })

  describe('PropertyListItem', () => {
    it('calls onToggleSave when bookmark button is clicked', async () => {
      const user = userEvent.setup()
      const onToggleSave = vi.fn()

      renderWithProviders(
        <PropertyListItem
          property={sampleProperty}
          isSaved={false}
          onToggleSave={onToggleSave}
        />,
      )

      await user.click(screen.getByRole('button', { name: translations.en.save }))
      expect(onToggleSave).toHaveBeenCalledWith('prop-1')
    })

    it('shows listing view count', () => {
      renderWithProviders(
        <PropertyListItem
          property={{ ...sampleProperty, views: 42 }}
          isSaved={false}
        />,
      )

      expect(screen.getByLabelText('42 Views')).toBeInTheDocument()
    })
  })

  describe('Support', () => {
    it('expands and collapses FAQ items when clicked', async () => {
      const user = userEvent.setup()

      renderWithProviders(<Support />)

      const faqContainer = screen.getByText(translations.en.faq1Q).closest('.rounded-2xl')
      const questionButtons = within(faqContainer).getAllByRole('button')

      expect(screen.getByText(translations.en.faq1A)).toBeInTheDocument()

      await user.click(questionButtons[0])
      expect(screen.queryByText(translations.en.faq1A)).not.toBeInTheDocument()

      await user.click(questionButtons[1])
      expect(screen.getByText(translations.en.faq2A)).toBeInTheDocument()
    })

    it('shows ticket form when Raise Ticket is clicked', async () => {
      const user = userEvent.setup()

      renderWithProviders(<Support />)

      await user.click(screen.getByRole('button', { name: /raise a ticket|raise ticket/i }))
      expect(screen.getByPlaceholderText(/subject/i)).toBeInTheDocument()

      await user.click(screen.getByRole('button', { name: /back/i }))
      expect(screen.queryByPlaceholderText(/subject/i)).not.toBeInTheDocument()
    })

    it('navigates to messages when Chat With Us is clicked', async () => {
      const user = userEvent.setup()

      renderWithProviders(<Support />)

      await user.click(screen.getByRole('button', { name: /chat with us/i }))
      expect(mockNavigate).toHaveBeenCalledWith('/messages')
    })
  })

  describe('Profile', () => {
    it('logs out and navigates to login when Sign Out is clicked', async () => {
      const user = userEvent.setup()
      const logout = vi.fn()

      renderWithProviders(<Profile />, { auth: { logout } })

      await user.click(screen.getByRole('button', { name: /sign out/i }))
      expect(logout).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith('/login')
    })
  })

  describe('Login', () => {
    async function acceptAllConsents(user) {
      const boxes = screen.getAllByRole('checkbox')
      for (const box of boxes) {
        await user.click(box)
      }
    }

    it('blocks sign-in until all consents are accepted', () => {
      const loginWithGoogle = vi.fn().mockResolvedValue({ id: 'user-1' })

      renderWithProviders(<Login />, { auth: { user: null, loginWithGoogle } })

      expect(screen.getByRole('button', { name: /continue with google/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /send otp/i })).toBeDisabled()
      expect(screen.getByRole('button', { name: /continue as guest/i })).toBeDisabled()
      expect(screen.getAllByRole('checkbox')).toHaveLength(2)
      expect(loginWithGoogle).not.toHaveBeenCalled()
    })

    it('calls loginWithGoogle when Continue with Google is clicked', async () => {
      const user = userEvent.setup()
      const loginWithGoogle = vi.fn().mockResolvedValue({ id: 'user-1' })

      renderWithProviders(<Login />, { auth: { user: null, loginWithGoogle } })

      await acceptAllConsents(user)
      await user.click(screen.getByRole('button', { name: /continue with google/i }))
      expect(loginWithGoogle).toHaveBeenCalledTimes(1)
    })

    it('requests OTP when Send OTP is clicked with valid phone', async () => {
      const user = userEvent.setup()
      const requestPhoneOtp = vi.fn().mockResolvedValue(undefined)

      renderWithProviders(<Login />, { auth: { user: null, requestPhoneOtp } })

      await acceptAllConsents(user)
      await user.type(screen.getByPlaceholderText(/phone/i), '9876543210')
      await user.click(screen.getByRole('button', { name: /send otp/i }))
      expect(requestPhoneOtp).toHaveBeenCalledWith('9876543210')
    })

    it('continues as guest and navigates to browse', async () => {
      const user = userEvent.setup()
      const continueAsGuest = vi.fn()

      renderWithProviders(<Login />, { auth: { user: null, continueAsGuest } })

      await acceptAllConsents(user)
      await user.click(screen.getByRole('button', { name: /continue as guest/i }))
      expect(continueAsGuest).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith('/browse', { replace: true, state: undefined })
    })

    it('continues as guest to browse when return path requires sign-in', async () => {
      const user = userEvent.setup()
      const continueAsGuest = vi.fn()

      renderWithProviders(<Login />, {
        route: '/login',
        routeState: { from: '/post' },
        auth: { user: null, continueAsGuest },
      })

      await acceptAllConsents(user)
      await user.click(screen.getByRole('button', { name: /continue as guest/i }))
      expect(continueAsGuest).toHaveBeenCalledTimes(1)
      expect(mockNavigate).toHaveBeenCalledWith('/browse', { replace: true, state: undefined })
    })
  })
})
