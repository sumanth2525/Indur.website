import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import BackButton from '../components/BackButton'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import {
  watchConversation,
  sendMessage,
  fetchPublicProfileById,
  fetchListingById,
} from '../services/dataApi'

export default function ChatThread() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { user } = useAuth()
  const [text, setText] = useState('')
  const [conv, setConv] = useState(null)
  const [other, setOther] = useState(null)
  const [prop, setProp] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    return watchConversation(id, setConv, console.error)
  }, [id])

  useEffect(() => {
    if (!conv || !user) return
    if (conv.entityType === 'service' || conv.serviceId) {
      setOther({ name: conv.providerName || t('localServices') })
      setProp(null)
      return
    }
    const otherId = conv.buyerId === user.id ? conv.sellerId : conv.buyerId
    fetchPublicProfileById(otherId).then(setOther)
    if (conv.propertyId) fetchListingById(conv.propertyId).then(setProp)
    else setProp(null)
  }, [conv, user, t])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conv?.messages?.length])

  const isParticipant = user && conv && (conv.buyerId === user.id || conv.sellerId === user.id)

  if (!conv) {
    return (
      <div className="flex flex-col items-center py-20">
        <p className="text-muted">{t('loading')}</p>
      </div>
    )
  }

  if (!isParticipant) {
    return (
      <div className="flex flex-col items-center py-20 px-5">
        <p className="text-muted">You do not have access to this conversation.</p>
        <button type="button" onClick={() => navigate('/messages')} className="mt-4 text-sm font-medium underline">
          {t('back')}
        </button>
      </div>
    )
  }

  const handleSend = async () => {
    if (!text.trim()) return
    await sendMessage(conv.id, user.id, text.trim())
    setText('')
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-56px)] lg:h-[calc(100dvh-120px)] lg:max-w-2xl lg:mx-auto lg:border lg:border-border lg:rounded-2xl lg:overflow-hidden lg:bg-white">
      <div className="flex items-center gap-3 border-b border-border px-4 py-3 bg-white">
        <BackButton fallback="/messages" className="p-1" />
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-white font-semibold shrink-0">
          {other?.name?.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm">{other?.name}</p>
          {prop ? (
            <p className="text-teal text-xs truncate">{prop.title}</p>
          ) : conv.serviceTitleKey ? (
            <p className="text-teal text-xs truncate">{t(conv.serviceTitleKey)}</p>
          ) : null}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-surface">
        {conv.messages.map((msg) => {
          const isMine = msg.senderId === user?.id
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  isMine
                    ? 'bg-teal text-white rounded-br-md'
                    : 'bg-white border border-border rounded-bl-md'
                }`}
              >
                {msg.text}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border bg-white px-4 py-3 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t('typeMessage')}
          className="flex-1 rounded-full border border-border px-4 py-2.5 text-sm outline-none focus:border-teal"
        />
        <button
          type="button"
          onClick={handleSend}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-white shrink-0"
        >
          <Icon name="send" size={18} />
        </button>
      </div>
    </div>
  )
}

