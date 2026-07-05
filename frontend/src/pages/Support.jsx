import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { createSupportTicket } from '../services/dataApi'

const FAQ_KEYS = [
  { q: 'faq1Q', a: 'faq1A' },
  { q: 'faq2Q', a: 'faq2A' },
  { q: 'faq3Q', a: 'faq3A' },
  { q: 'faq4Q', a: 'faq4A' },
]

export default function Support() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(0)
  const [showTicket, setShowTicket] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleTicket = async () => {
    if (!subject || !message) return
    await createSupportTicket(user.id, subject, message)
    setSubmitted(true)
    setShowTicket(false)
    setSubject('')
    setMessage('')
  }

  return (
    <div className="px-4 lg:max-w-2xl lg:mx-auto lg:px-0">
      <div className="flex items-center gap-3 mb-6 pt-2">
        <h1 className="text-xl lg:text-2xl font-bold">{t('helpTitle')}</h1>
      </div>

      {submitted && (
        <div className="mb-4 rounded-xl bg-teal-light text-teal px-4 py-3 text-sm">
          {t('ticketSubmitted')}
        </div>
      )}

      <p className="text-xs text-muted tracking-widest mb-3">{t('frequentlyAsked')}</p>
      <div className="rounded-2xl border border-border bg-white overflow-hidden mb-8">
        {FAQ_KEYS.map((faq, i) => (
          <div key={faq.q} className={i < FAQ_KEYS.length - 1 ? 'border-b border-border' : ''}>
            <button
              type="button"
              onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              className="flex w-full items-center justify-between px-4 py-4 text-left"
            >
              <span className="text-sm font-medium pr-4">{t(faq.q)}</span>
              <Icon
                name="expand_more"
                size={18}
                className={`text-muted shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
              />
            </button>
            {openFaq === i && (
              <div className="px-4 pb-4 text-sm text-muted leading-relaxed">{t(faq.a)}</div>
            )}
          </div>
        ))}
      </div>

      {showTicket ? (
        <div className="rounded-2xl border border-border bg-white p-4 space-y-4 mb-6">
          <input
            type="text"
            placeholder={t('ticketSubject')}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-teal"
          />
          <textarea
            placeholder={t('ticketMessage')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-teal resize-none"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowTicket(false)}
              className="flex-1 rounded-full border border-border py-3 text-sm font-medium"
            >
              {t('cancel')}
            </button>
            <button
              type="button"
              onClick={handleTicket}
              className="flex-1 rounded-full bg-teal py-3 text-sm font-medium text-white"
            >
              {t('submitTicket')}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3 pb-8">
          <button
            type="button"
            onClick={() => navigate('/messages')}
            className="w-full rounded-full bg-teal py-3.5 font-medium text-white hover:bg-teal-dark transition-colors"
          >
            {t('chatWithUs')}
          </button>
          <button
            type="button"
            onClick={() => setShowTicket(true)}
            className="w-full rounded-full border border-text py-3.5 font-medium hover:bg-surface transition-colors"
          >
            {t('raiseTicket')}
          </button>
        </div>
      )}
    </div>
  )
}
