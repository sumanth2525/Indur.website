import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Camera } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { useAuth } from '../context/AuthContext'
import { createProperty } from '../data/seed'
import { LOCATIONS } from '../i18n/translations'

const STEPS = ['category', 'details', 'photos', 'priceLocation']
const CATEGORIES = ['house', 'land', 'apartment']

const PLACEHOLDER_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
]

export default function PostAd() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    type: 'house',
    title: '',
    description: '',
    images: [],
    price: '',
    area: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }))

  const handleAddPhoto = () => {
    const next = PLACEHOLDER_IMAGES[form.images.length % PLACEHOLDER_IMAGES.length]
    update('images', [...form.images, next])
  }

  const handleSubmit = () => {
    if (!form.title || !form.price || !form.area) return
    createProperty(
      {
        type: form.type,
        purpose: 'sell',
        title: form.title,
        description: form.description,
        price: Number(form.price),
        location: { area: form.area, city: 'Nizamabad', lat: 18.6725, lng: 78.0941 },
        images: form.images.length ? form.images : [PLACEHOLDER_IMAGES[0]],
        sqft: form.type === 'land' ? 2400 : 1200,
        bedrooms: form.type === 'house' ? 2 : form.type === 'apartment' ? 3 : 0,
        facing: 'East',
        readyToMove: form.type !== 'land',
      },
      user.id,
    )
    setSubmitted(true)
    setTimeout(() => navigate('/'), 1500)
  }

  const canNext = () => {
    if (step === 0) return !!form.type
    if (step === 1) return form.title.length > 3
    if (step === 2) return true
    if (step === 3) return form.price && form.area
    return false
  }

  return (
    <div className="px-4 lg:max-w-2xl lg:mx-auto lg:px-0">
      <div className="flex items-center gap-3 mb-6 pt-2">
        <button type="button" onClick={() => navigate(-1)} className="rounded-full p-1 hover:bg-surface">
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold">{t('postProperty')}</h1>
      </div>

      {/* Step indicator */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div
              className={`h-2 rounded-full transition-all ${
                i <= step ? 'bg-teal w-8' : 'bg-border w-6'
              }`}
            />
            <span className={`text-xs ${i === step ? 'text-teal font-medium' : 'text-muted'}`}>
              {t(s === 'priceLocation' ? 'priceLocation' : s)}
            </span>
          </div>
        ))}
      </div>

      {submitted ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="text-5xl mb-4">✅</div>
          <p className="font-semibold text-lg">{t('listingPosted')}</p>
        </div>
      ) : (
        <>
          {step === 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted mb-4">{t('category')}</p>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => update('type', cat)}
                  className={`w-full rounded-2xl border-2 p-5 text-left font-medium transition-colors ${
                    form.type === cat
                      ? 'border-teal bg-teal-light'
                      : 'border-border hover:border-teal/50'
                  }`}
                >
                  {t(cat)}
                </button>
              ))}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t('title')}</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder={t('titlePlaceholder')}
                  className="mt-1.5 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-teal"
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t('description')}</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder={t('descPlaceholder')}
                  rows={5}
                  className="mt-1.5 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-teal resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-sm font-medium mb-3">{t('photos')}</p>
              <div className="grid grid-cols-2 gap-3">
                {form.images.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
                {form.images.length < 4 && (
                  <button
                    type="button"
                    onClick={handleAddPhoto}
                    className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-border text-muted hover:border-teal hover:text-teal transition-colors"
                  >
                    <Camera size={28} />
                    <span className="text-xs mt-2">{t('uploadPhotos')}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">{t('price')}</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => update('price', e.target.value)}
                  placeholder="6800000"
                  className="mt-1.5 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-teal"
                />
              </div>
              <div>
                <label className="text-sm font-medium">{t('location')}</label>
                <select
                  value={form.area}
                  onChange={(e) => update('area', e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-teal"
                >
                  <option value="">{t('selectLocation')}</option>
                  {LOCATIONS.filter((l) => l !== 'Nizamabad').map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-8 pb-8">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex-1 rounded-full border border-border py-3 font-medium hover:bg-surface"
              >
                {t('back')}
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext()}
                className="flex-1 rounded-full bg-text py-3 font-medium text-white hover:bg-black disabled:opacity-40"
              >
                {t('next')}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canNext()}
                className="flex-1 rounded-full bg-text py-3 font-medium text-white hover:bg-black disabled:opacity-40"
              >
                {t('postListing')}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
