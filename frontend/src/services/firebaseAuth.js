import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth } from '../lib/firebase'
import { loadProfile } from './dataApi'

const googleProvider = new GoogleAuthProvider()

export function mapFirebaseUser(fbUser) {
  const provider = fbUser.providerData?.[0]?.providerId
  return {
    id: fbUser.uid,
    name: fbUser.displayName || 'User',
    email: fbUser.email || '',
    phone: fbUser.phoneNumber || '',
    photoURL: fbUser.photoURL || '',
    authProvider: provider === 'google.com' ? 'google' : provider === 'phone' ? 'phone' : 'firebase',
    lang: 'en',
    location: 'Nizamabad',
    saved: [],
    views: 0,
  }
}

export function subscribeToAuthChanges(onUser) {
  if (!auth) {
    onUser(null)
    return () => {}
  }
  return onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) {
      onUser(null)
      return
    }
    try {
      const defaults = mapFirebaseUser(fbUser)
      const profile = await loadProfile(fbUser.uid, defaults)
      onUser({ ...defaults, ...profile, id: fbUser.uid })
    } catch (err) {
      console.error('Failed to load profile', err)
      onUser(mapFirebaseUser(fbUser))
    }
  })
}

export async function signInWithGoogle() {
  if (!auth) throw new Error('Firebase Auth is not configured')
  const result = await signInWithPopup(auth, googleProvider)
  const defaults = mapFirebaseUser(result.user)
  const profile = await loadProfile(result.user.uid, defaults)
  return { ...defaults, ...profile, id: result.user.uid }
}

export async function completePhoneSignIn(fbUser, phoneLabel) {
  const defaults = {
    ...mapFirebaseUser(fbUser),
    phone: phoneLabel || fbUser.phoneNumber || '',
    authProvider: 'phone',
    name: fbUser.displayName || 'User',
  }
  const profile = await loadProfile(fbUser.uid, defaults)
  return { ...defaults, ...profile, id: fbUser.uid }
}

export async function firebaseSignOut() {
  if (!auth) return
  await signOut(auth)
}
