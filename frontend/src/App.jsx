import { Routes, Route, Navigate, useLocation } from 'react-router-dom'

import { Analytics } from '@vercel/analytics/react'

import { useAuth } from './context/AuthContext'

import AnalyticsRouteTracker from './components/AnalyticsRouteTracker'

import AppLayout from './components/AppLayout'

import Login from './pages/Login'

import Home from './pages/Home'
import LocalServices from './pages/LocalServices'
import ServiceDetail from './pages/ServiceDetail'

import PropertyDetail from './pages/PropertyDetail'

import PostAd from './pages/PostAd'

import Messages from './pages/Messages'

import ChatThread from './pages/ChatThread'

import Profile from './pages/Profile'

import Support from './pages/Support'

import EditProfile from './pages/EditProfile'

import MyListings from './pages/MyListings'

import Notifications from './pages/Notifications'
import LegalPage from './pages/LegalPage'



function LoginRedirect() {
  const location = useLocation()
  return <Navigate to="/" replace state={location.state} />
}



function GuestAllowedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white">
        <p className="text-sm text-muted">Loading…</p>
      </div>
    )
  }

  if (!user) {
    const from = `${location.pathname}${location.search}`
    return <Navigate to="/" replace state={{ from: from === '/' || from === '/login' ? '/browse' : from }} />
  }

  return children
}



function AuthRequiredRoute({ children }) {

  const { isAuthenticated, loading } = useAuth()

  const location = useLocation()

  if (loading) {

    return (

      <div className="flex min-h-dvh items-center justify-center bg-white">

        <p className="text-sm text-muted">Loading…</p>

      </div>

    )

  }

  if (!isAuthenticated) {
    const from = `${location.pathname}${location.search}`
    return <Navigate to="/" replace state={{ from }} />
  }

  return children

}



export default function App() {

  const location = useLocation()

  const analyticsPath = `${location.pathname}${location.search}${location.hash}`



  return (

    <>

    <AnalyticsRouteTracker />

    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/login" element={<LoginRedirect />} />

      <Route path="/terms" element={<LegalPage type="terms" />} />
      <Route path="/privacy" element={<LegalPage type="privacy" />} />

      <Route

        element={

          <GuestAllowedRoute>

            <AppLayout />

          </GuestAllowedRoute>

        }

      >

        <Route path="browse" element={<Home />} />
        <Route path="services" element={<LocalServices />} />
        <Route path="services/:id" element={<ServiceDetail />} />

        <Route path="property/:id" element={<PropertyDetail />} />

        <Route path="post" element={<AuthRequiredRoute><PostAd /></AuthRequiredRoute>} />

        <Route path="messages" element={<AuthRequiredRoute><Messages /></AuthRequiredRoute>} />

        <Route path="messages/:id" element={<AuthRequiredRoute><ChatThread /></AuthRequiredRoute>} />

        <Route path="profile" element={<AuthRequiredRoute><Profile /></AuthRequiredRoute>} />

        <Route path="profile/edit" element={<AuthRequiredRoute><EditProfile /></AuthRequiredRoute>} />

        <Route path="profile/listings" element={<AuthRequiredRoute><MyListings /></AuthRequiredRoute>} />

        <Route path="profile/saved" element={<Navigate to="/browse" replace />} />

        <Route path="profile/notifications" element={<AuthRequiredRoute><Notifications /></AuthRequiredRoute>} />

        <Route path="support" element={<AuthRequiredRoute><Support /></AuthRequiredRoute>} />

      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>

    <Analytics path={analyticsPath} route={location.pathname} />

    </>

  )

}


