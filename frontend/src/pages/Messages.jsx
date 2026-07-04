import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { storage, formatTime } from '../services/storage'
import { getUserById, getPropertyById } from '../data/seed'

export default function Messages() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [conversations, setConversations] = useState(() => storage.getConversations())

  const myConvs = useMemo(() => {
    return conversations
      .filter((c) => c.buyerId === user?.id || c.sellerId === user?.id)
      .filter((c) => {
        if (!search) return true
        const otherId = c.buyerId === user?.id ? c.sellerId : c.buyerId
        const other = getUserById(otherId)
        const prop = getPropertyById(c.propertyId)
        const q = search.toLowerCase()
        return other?.name?.toLowerCase().includes(q) || prop?.title?.toLowerCase().includes(q)
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  }, [conversations, user, search])

  return (
    <div className="px-4 lg:px-0">
      <h1 className="text-2xl lg:text-3xl font-bold pt-2 mb-4">{t('messages')}</h1>

      <div className="relative mb-6">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
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
            const other = getUserById(otherId)
            const prop = getPropertyById(conv.propertyId)
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
                    <p className="font-semibold text-sm">{other?.name}</p>
                    {lastMsg && (
                      <span className="text-xs text-muted shrink-0 ml-2">
                        {formatTime(lastMsg.timestamp)}
                      </span>
                    )}
                  </div>
                  {prop && (
                    <p className="text-teal text-xs truncate">{prop.title}</p>
                  )}
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
