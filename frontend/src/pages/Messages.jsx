import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { formatTime } from '../services/formatters'
import {
  watchConversations,
  fetchPublicProfileById,
  fetchListingById,
} from '../services/dataApi'

export default function Messages() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [conversations, setConversations] = useState([])
  const [meta, setMeta] = useState({})

  useEffect(() => {
    if (!user?.id) return
    return watchConversations(user.id, setConversations, console.error)
  }, [user?.id])

  useEffect(() => {
    async function loadMeta() {
      const entries = {}
      for (const conv of conversations) {
        if (conv.entityType === 'service' || conv.serviceId) {
          entries[conv.id] = {
            other: { name: conv.providerName || t('localServices') },
            prop: null,
            serviceTitle: conv.serviceTitleKey ? t(conv.serviceTitleKey) : t('localServices'),
          }
          continue
        }
        const otherId = conv.buyerId === user?.id ? conv.sellerId : conv.buyerId
        const [other, prop] = await Promise.all([
          fetchPublicProfileById(otherId),
          conv.propertyId ? fetchListingById(conv.propertyId) : Promise.resolve(null),
        ])
        entries[conv.id] = { other, prop }
      }
      setMeta(entries)
    }
    if (conversations.length) loadMeta()
    else setMeta({})
  }, [conversations, user?.id, t])

  const myConvs = useMemo(() => {
    return conversations.filter((c) => {
      if (!search) return true
      const { other, prop } = meta[c.id] || {}
      const q = search.toLowerCase()
      return other?.name?.toLowerCase().includes(q)
        || prop?.title?.toLowerCase().includes(q)
        || meta[c.id]?.serviceTitle?.toLowerCase().includes(q)
    })
  }, [conversations, user, search, meta])

  return (
    <div className="px-4 lg:px-0">
      <h1 className="text-2xl lg:text-3xl font-bold pt-2 mb-4">{t('messages')}</h1>

      <div className="relative mb-6">
        <Icon name="search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder={t('searchConversations')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full border border-border bg-white pl-11 pr-4 py-3 text-sm outline-none focus:border-teal lg:max-w-md"
        />
      </div>

      {myConvs.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="text-5xl mb-4">💬</div>
          <p className="font-medium">{t('noMessages')}</p>
          <p className="text-muted text-sm mt-1">{t('noMessagesSub')}</p>
        </div>
      ) : (
        <div className="lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-4 flex flex-col gap-1">
          {myConvs.map((conv) => {
            const otherId = conv.buyerId === user?.id ? conv.sellerId : conv.buyerId
            const { other, prop, serviceTitle } = meta[conv.id] || {}
            const lastMsg = conv.messages[conv.messages.length - 1]
            const unread = conv.messages.some(
              (m) => m.senderId !== user?.id && new Date(conv.updatedAt) > new Date(Date.now() - 3600000),
            )

            return (
              <Link
                key={conv.id}
                to={`/messages/${conv.id}`}
                className="flex items-center gap-3 rounded-2xl p-3 hover:bg-white lg:border lg:border-border lg:bg-white transition-colors"
              >
                <div className="relative shrink-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal text-white font-semibold">
                    {other?.name?.charAt(0) || '?'}
                  </div>
                  {unread && (
                    <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{other?.name || 'User'}</p>
                    {lastMsg && (
                      <span className="text-xs text-muted shrink-0 ml-2">
                        {formatTime(lastMsg.timestamp)}
                      </span>
                    )}
                  </div>
                  {serviceTitle ? (
                    <p className="text-teal text-xs truncate">{serviceTitle}</p>
                  ) : prop ? (
                    <p className="text-teal text-xs truncate">{prop.title}</p>
                  ) : null}
                  {lastMsg && (
                    <p className="text-muted text-sm truncate mt-0.5">{lastMsg.text}</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
