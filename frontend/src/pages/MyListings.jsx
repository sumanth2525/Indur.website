import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { storage, formatPrice } from '../services/storage'
import { deleteProperty, updateProperty } from '../data/seed'

export default function MyListings() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [listings, setListings] = useState(() =>
    storage.getProperties().filter((p) => p.sellerId === user?.id),
  )

  const refresh = () => setListings(storage.getProperties().filter((p) => p.sellerId === user?.id))

  const handleDelete = (id) => {
    deleteProperty(id)
    refresh()
  }

  const handleMarkSold = (id) => {
    updateProperty(id, { status: 'sold' })
    refresh()
  }

  return (
    <div className="px-4 lg:max-w-3xl lg:mx-auto lg:px-0">
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button type="button" onClick={() => navigate(-1)} className="rounded-full p-1">
          <Icon name="arrow_back" size={22} />
        </button>
        <h1 className="text-xl font-bold">{t('myListings')}</h1>
      </div>

      {listings.length === 0 ? (
        <p className="text-muted text-center py-12">{t('noProperties')}</p>
      ) : (
        <div className="space-y-3">
          {listings.map((p) => (
            <div key={p.id} className="flex gap-3 rounded-2xl border border-border bg-white p-3">
              <img
                src={p.images?.[0]}
                alt=""
                className="h-20 w-20 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm line-clamp-1">{p.title}</p>
                <p className="font-bold text-sm mt-0.5">{formatPrice(p.price)}</p>
                <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-xs ${
                  p.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                  p.status === 'sold' ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {t(p.status)}
                </span>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                {p.status === 'active' && (
                  <button
                    type="button"
                    onClick={() => handleMarkSold(p.id)}
                    className="text-xs text-teal font-medium"
                  >
                    {t('markSold')}
                  </button>
                )}
                <button type="button" onClick={() => handleDelete(p.id)} className="text-red-500">
                  <Icon name="delete" size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
