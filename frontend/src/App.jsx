import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AppLayout from './components/AppLayout'
import Login from './pages/Login'
import Home from './pages/Home'
import PropertyDetail from './pages/PropertyDetail'
import PostAd from './pages/PostAd'
import Messages from './pages/Messages'
import ChatThread from './pages/ChatThread'
import Profile from './pages/Profile'
import Support from './pages/Support'
import EditProfile from './pages/EditProfile'
import MyListings from './pages/MyListings'
import SavedProperties from './pages/SavedProperties'
import Notifications from './pages/Notifications'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="property/:id" element={<PropertyDetail />} />
        <Route path="post" element={<PostAd />} />
        <Route path="messages" element={<Messages />} />
        <Route path="messages/:id" element={<ChatThread />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/edit" element={<EditProfile />} />
        <Route path="profile/listings" element={<MyListings />} />
        <Route path="profile/saved" element={<SavedProperties />} />
        <Route path="profile/notifications" element={<Notifications />} />
        <Route path="support" element={<Support />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
