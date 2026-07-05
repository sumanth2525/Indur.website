import { useState, useEffect } from 'react'
import Icon from '../components/Icon'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../services/formatters'
import { fetchSellerListings, removeListing, updateListingRecord } from '../services/dataApi'

export default function MyListings() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [listings, setListings] = useState([])

  const refresh = async () => {
    if (!user?.id) return
    setListings(await fetchSellerListings(user.id))
  }

  useEffect(() => {
    refresh()
  }, [user?.id])

  const handleDelete = async (id) => {
    await removeListing(id)
    refresh()
  }

  const handleMarkSold = async (id) => {
    await updateListingRecord(id, { status: 'sold' })
    refresh()
  }

  return (
    <div className="px-4 lg:max-w-3xl lg:mx-auto lg:px-0">
      <div className="mb-6 pt-2">
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
