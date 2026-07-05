import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { COLLECTIONS, docToConversation } from './schema'
import { generateId } from '../formatters'

const conversationsRef = () => collection(db, COLLECTIONS.conversations)

export async function getConversation(id) {
  const snap = await getDoc(doc(db, COLLECTIONS.conversations, id))
  if (!snap.exists()) return null
  return docToConversation(snap.id, snap.data())
}

export function subscribeUserConversations(userId, onConversations, onError) {
  const buyerQuery = query(conversationsRef(), where('buyerId', '==', userId))
  const sellerQuery = query(conversationsRef(), where('sellerId', '==', userId))

  let buyerDocs = []
  let sellerDocs = []

  const emit = () => {
    const byId = new Map()
    for (const c of [...buyerDocs, ...sellerDocs]) byId.set(c.id, c)
    onConversations([...byId.values()].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)))
  }

  const unsubBuyer = onSnapshot(
    buyerQuery,
    (snap) => {
      buyerDocs = snap.docs.map((d) => docToConversation(d.id, d.data()))
      emit()
    },
    onError,
  )

  const unsubSeller = onSnapshot(
    sellerQuery,
    (snap) => {
      sellerDocs = snap.docs.map((d) => docToConversation(d.id, d.data()))
      emit()
    },
    onError,
  )

  return () => {
    unsubBuyer()
    unsubSeller()
  }
}

export function subscribeConversation(id, onConversation, onError) {
  return onSnapshot(
    doc(db, COLLECTIONS.conversations, id),
    (snap) => {
      if (!snap.exists()) {
        onConversation(null)
        return
      }
      onConversation(docToConversation(snap.id, snap.data()))
    },
    onError,
  )
}

export async function getOrCreateConversation(buyerId, sellerId, propertyId) {
  const existing = await getDocs(
    query(
      conversationsRef(),
      where('propertyId', '==', propertyId),
      where('buyerId', '==', buyerId),
      where('sellerId', '==', sellerId),
    ),
  )
  if (!existing.empty) {
    const d = existing.docs[0]
    return docToConversation(d.id, d.data())
  }

  const ref = await addDoc(conversationsRef(), {
    entityType: 'property',
    propertyId,
    buyerId,
    sellerId,
    messages: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return getConversation(ref.id)
}

export async function getOrCreateServiceConversation(buyerId, provider, serviceTitleKey) {
  const sellerId = provider.providerUserId || `svc_${provider.id}`
  const existing = await getDocs(
    query(
      conversationsRef(),
      where('entityType', '==', 'service'),
      where('serviceId', '==', provider.serviceId),
      where('providerDocId', '==', provider.id),
      where('buyerId', '==', buyerId),
    ),
  )
  if (!existing.empty) {
    const d = existing.docs[0]
    return docToConversation(d.id, d.data())
  }

  const ref = await addDoc(conversationsRef(), {
    entityType: 'service',
    serviceId: provider.serviceId,
    providerDocId: provider.id,
    serviceTitleKey,
    providerName: provider.provider?.name || '',
    buyerId,
    sellerId,
    messages: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return getConversation(ref.id)
}

export async function addMessage(conversationId, senderId, text) {
  const ref = doc(db, COLLECTIONS.conversations, conversationId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null

  const msg = {
    id: generateId(),
    senderId,
    text,
    timestamp: new Date().toISOString(),
  }

  await updateDoc(ref, {
    messages: arrayUnion(msg),
    updatedAt: serverTimestamp(),
  })
  return msg
}
