import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { patchProfile } from '../services/dataApi'
import { resolveBrowseLocation } from '../services/formatters'
import LocationPicker from '../components/LocationPicker'

export default function EditProfile() {
  const { t } = useLanguage()
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [location, setLocation] = useState(() => resolveBrowseLocation(user))
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await patchProfile(user.id, {
        ...form,
        location: location.label,
        browseLocation: location,
      })
      if (updated) setUser(updated)
      navigate('/profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="px-4 lg:max-w-lg lg:mx-auto lg:px-0">
      <div className="mb-6 pt-2">
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
          <label className="text-sm font-medium block mb-2">{t('location')}</label>
          <LocationPicker value={location} onChange={setLocation} className="w-full !max-w-none" />
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-full bg-teal py-3.5 font-medium text-white mt-4 disabled:opacity-50"
        >
          {saving ? 'Saving…' : t('saveProfile')}
        </button>
      </div>
    </div>
  )
}
