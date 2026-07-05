import * as profiles from './firestore/profiles'
import * as listings from './firestore/listings'
import * as conversations from './firestore/conversations'
import * as tickets from './firestore/tickets'
import * as localServices from './firestore/localServices'
import { uploadListingImages } from './firestore/images'

export async function fetchListings() {
  return listings.getActiveListings()
}

export function watchListings(onListings, onError) {
  return listings.subscribeActiveListings(onListings, onError)
}

export async function fetchListingById(id) {
  return listings.getListing(id)
}

export async function fetchSellerListings(sellerId) {
  return listings.getListingsBySeller(sellerId)
}

export async function saveProfile(uid, profile) {
  return profiles.upsertProfile(uid, profile)
}

export async function patchProfile(uid, updates) {
  return profiles.updateProfile(uid, updates)
}

export async function loadProfile(uid, defaults) {
  return profiles.loadOrCreateProfile(uid, defaults)
}

export async function fetchProfileById(uid) {
  return profiles.getProfile(uid)
}

export async function fetchPublicProfileById(uid) {
  return profiles.getPublicProfile(uid)
}

export async function createListing(data, sellerId, imageFiles = []) {
  const listing = await listings.createListing(data, sellerId)
  if (imageFiles.length) {
    const urls = await uploadListingImages(listing.id, imageFiles)
    return listings.setListingImages(listing.id, urls)
  }
  if (data.images?.length) {
    return listings.setListingImages(listing.id, data.images)
  }
  return listing
}

export async function updateListingRecord(id, updates) {
  return listings.updateListing(id, updates)
}

export async function removeListing(id) {
  return listings.deleteListing(id)
}

export async function bumpListingViews(id) {
  return listings.incrementListingViews(id)
}

export async function toggleSavedListing(userId, listingId) {
  const user = await profiles.getProfile(userId)
  if (!user) return false
  const saved = user.saved || []
  const isSaved = saved.includes(listingId)
  const newSaved = isSaved ? saved.filter((id) => id !== listingId) : [...saved, listingId]
  await profiles.updateProfile(userId, { saved: newSaved })
  await listings.adjustSaveCount(listingId, isSaved ? -1 : 1)
  return !isSaved
}

export async function getListingSaveCount(listingId) {
  const listing = await listings.getListing(listingId)
  return listing?.saveCount || 0
}

export function watchConversations(userId, onConversations, onError) {
  return conversations.subscribeUserConversations(userId, onConversations, onError)
}

export function watchConversation(id, onConversation, onError) {
  return conversations.subscribeConversation(id, onConversation, onError)
}

export async function getOrCreateConversation(buyerId, sellerId, propertyId) {
  return conversations.getOrCreateConversation(buyerId, sellerId, propertyId)
}

export async function getOrCreateServiceConversation(buyerId, provider, serviceTitleKey) {
  return conversations.getOrCreateServiceConversation(buyerId, provider, serviceTitleKey)
}

export async function fetchServiceProviders(serviceId) {
  return localServices.getActiveProvidersForService(serviceId)
}

export async function sendMessage(conversationId, senderId, text) {
  return conversations.addMessage(conversationId, senderId, text)
}

export async function createSupportTicket(userId, subject, message) {
  return tickets.createTicket(userId, subject, message)
}

export async function fetchServiceCategories() {
  return localServices.getActiveServiceCategories()
}

export async function fetchServiceCategory(id) {
  return localServices.getServiceCategory(id)
}

export async function fetchPrimaryServiceProvider(serviceId) {
  return localServices.getPrimaryProviderForService(serviceId)
}
