import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { db, firebaseEnabled } from '../../lib/firebase'
import { COLLECTIONS, docToServiceCategory, docToServiceProvider } from './schema'

const categoriesRef = () => collection(db, COLLECTIONS.serviceCategories)
const providersRef = () => collection(db, COLLECTIONS.serviceProviders)

export async function getActiveServiceCategories() {
  if (!firebaseEnabled || !db) return []
  const q = query(
    categoriesRef(),
    where('status', '==', 'active'),
    orderBy('sortOrder', 'asc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => docToServiceCategory(d.id, d.data()))
}

export async function getServiceCategory(id) {
  if (!firebaseEnabled || !db || !id) return null
  const snap = await getDoc(doc(db, COLLECTIONS.serviceCategories, id))
  if (!snap.exists()) return null
  return docToServiceCategory(snap.id, snap.data())
}

export async function getActiveProvidersForService(serviceId) {
  if (!firebaseEnabled || !db || !serviceId) return []
  const q = query(
    providersRef(),
    where('serviceId', '==', serviceId),
    where('status', '==', 'active'),
    orderBy('sortOrder', 'asc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => docToServiceProvider(d.id, d.data()))
}

export async function getPrimaryProviderForService(serviceId) {
  const providers = await getActiveProvidersForService(serviceId)
  return providers[0] ?? null
}
