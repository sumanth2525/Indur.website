import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db, firebaseEnabled } from '../../lib/firebase'
import { COLLECTIONS, docToProfile, profileToFirestore } from './schema'

function publicProfilePayload(profile) {
  const data = {
    name: profile.name || '',
    photoURL: profile.photoURL || '',
    updatedAt: serverTimestamp(),
  }
  if (profile.phone) data.contactPhone = profile.phone
  return data
}

async function syncPublicProfile(uid, profile) {
  if (!firebaseEnabled || !db) return
  await setDoc(doc(db, COLLECTIONS.publicProfiles, uid), publicProfilePayload(profile), { merge: true })
}

export async function getProfile(uid) {
  if (!firebaseEnabled || !db) return null
  const snap = await getDoc(doc(db, COLLECTIONS.profiles, uid))
  if (!snap.exists()) return null
  return docToProfile(snap.id, snap.data())
}

export async function getPublicProfile(uid) {
  if (!firebaseEnabled || !db) return null
  const snap = await getDoc(doc(db, COLLECTIONS.publicProfiles, uid))
  if (!snap.exists()) return null
  const data = snap.data()
  return {
    id: uid,
    name: data.name || '',
    photoURL: data.photoURL || '',
    contactPhone: data.contactPhone || '',
  }
}

export async function upsertProfile(uid, profile) {
  if (!firebaseEnabled || !db) return profile
  const ref = doc(db, COLLECTIONS.profiles, uid)
  const existing = await getDoc(ref)
  const payload = {
    ...profileToFirestore(profile),
    updatedAt: serverTimestamp(),
  }
  if (!existing.exists()) {
    await setDoc(ref, { ...payload, createdAt: serverTimestamp() })
  } else {
    await updateDoc(ref, payload)
  }
  await syncPublicProfile(uid, profile)
  return getProfile(uid)
}

export async function updateProfile(uid, updates) {
  if (!firebaseEnabled || !db) return null
  const ref = doc(db, COLLECTIONS.profiles, uid)
  const allowed = {}
  for (const key of ['name', 'email', 'phone', 'photoURL', 'location', 'browseLocation', 'saved', 'views', 'lang']) {
    if (updates[key] !== undefined) allowed[key] = updates[key]
  }
  await updateDoc(ref, { ...allowed, updatedAt: serverTimestamp() })
  const updated = await getProfile(uid)
  if (updated) await syncPublicProfile(uid, updated)
  return updated
}

export async function loadOrCreateProfile(uid, defaults) {
  const existing = await getProfile(uid)
  if (existing) return existing
  await upsertProfile(uid, defaults)
  return getProfile(uid)
}
