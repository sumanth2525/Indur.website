import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { updateUser } from '../data/seed'
import { storage } from '../services/storage'
import { LOCATIONS } from '../i18n/translations'

export default function EditProfile() {
  const { t } = useLanguage()
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    location: user?.location || storage.getLocation(),
  })

  const handleSave = () => {
    const updated = updateUser(user.id, form)
    storage.setCurrentUser(updated)
    setUser(updated)
    storage.setLocation(form.location)
    navigate('/profile')
  }

  return (
    <div className="px-4 lg:max-w-lg lg:mx-auto lg:px-0">
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button type="button" onClick={() => navigate(-1)} className="rounded-full p-1">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold">{t('editProfile')}</h1>
      </div>

      <div className="space-y-4">
        {['name', 'phone', 'email'].map((field) => (
          <div key={field}>
            <label className="text-sm font-medium">{t(field)}</label>
            <input
              type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
              value={form[field]}
              onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
              className="mt-1.5 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-teal"
            />
          </div>
        ))}
        <div>
          <label className="text-sm font-medium">{t('location')}</label>
          <select
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            className="mt-1.5 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-teal"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-full bg-teal py-3.5 font-medium text-white mt-4"
        >
          {t('saveProfile')}
        </button>
      </div>
    </div>
  )
}
