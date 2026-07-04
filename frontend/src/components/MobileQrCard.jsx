import { useState, useMemo, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Smartphone, Copy, Check, RefreshCw, AlertCircle } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'

const STORAGE_KEY = 'nizam_mobile_url'
const DEV_PORT = '5173'

/** Detect LAN IP via WebRTC (works in Chrome/Edge on localhost). */
function detectLocalIp() {
  return new Promise((resolve) => {
    if (typeof RTCPeerConnection === 'undefined') {
      resolve(null)
      return
    }

    const pc = new RTCPeerConnection({ iceServers: [] })
    pc.createDataChannel('')
    const timeout = setTimeout(() => {
      pc.close()
      resolve(null)
    }, 3000)

    pc.onicecandidate = (e) => {
      if (!e.candidate) return
      const match = /(\d{1,3}(?:\.\d{1,3}){3})/.exec(e.candidate.candidate)
      if (match && !match[1].startsWith('127.')) {
        clearTimeout(timeout)
        pc.close()
        resolve(match[1])
      }
    }

    pc.createOffer()
      .then((offer) => pc.setLocalDescription(offer))
      .catch(() => {
        clearTimeout(timeout)
        pc.close()
        resolve(null)
      })
  })
}

function buildMobileUrl(ip) {
  return `http://${ip}:${DEV_PORT}`
}

export default function MobileQrCard() {
  const { t } = useLanguage()
  const isLocalhost =
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

  const [detectedIp, setDetectedIp] = useState(null)
  const [detecting, setDetecting] = useState(isLocalhost)
  const [urlInput, setUrlInput] = useState('')
  const [savedUrl, setSavedUrl] = useState(() => localStorage.getItem(STORAGE_KEY) || '')
  const [copied, setCopied] = useState(false)
  const [serverOk, setServerOk] = useState(null)

  const runDetection = async () => {
    setDetecting(true)
    const ip = await detectLocalIp()
    setDetectedIp(ip)
    if (ip && !savedUrl) {
      setUrlInput(buildMobileUrl(ip))
    }
    setDetecting(false)
    return ip
  }

  useEffect(() => {
    if (!isLocalhost) return
    runDetection()
  }, [isLocalhost])

  const qrUrl = useMemo(() => {
    if (!isLocalhost) return window.location.origin

    const candidate = savedUrl || urlInput
    if (candidate) {
      try {
        return new URL(candidate).origin
      } catch {
        /* fall through */
      }
    }
    if (detectedIp) return buildMobileUrl(detectedIp)
    return buildMobileUrl('YOUR-IP-HERE')
  }, [savedUrl, urlInput, detectedIp, isLocalhost])

  const isPlaceholder = qrUrl.includes('YOUR-IP-HERE') || qrUrl.includes('192.168.1.1')

  useEffect(() => {
    if (!isLocalhost || isPlaceholder) {
      setServerOk(null)
      return
    }
    let cancelled = false
    fetch(qrUrl, { mode: 'no-cors' })
      .then(() => { if (!cancelled) setServerOk(true) })
      .catch(() => { if (!cancelled) setServerOk(false) })
    return () => { cancelled = true }
  }, [qrUrl, isLocalhost, isPlaceholder])

  const handleSave = () => {
    const trimmed = urlInput.trim().replace(/\/$/, '')
    localStorage.setItem(STORAGE_KEY, trimmed)
    setSavedUrl(trimmed)
  }

  const handleUseDetected = () => {
    if (!detectedIp) return
    const url = buildMobileUrl(detectedIp)
    setUrlInput(url)
    localStorage.setItem(STORAGE_KEY, url)
    setSavedUrl(url)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-5 mb-6 lg:mb-0">
      <div className="flex items-center gap-2 mb-1">
        <Smartphone size={18} className="text-teal" />
        <p className="font-semibold text-sm">{t('scanOnMobile')}</p>
      </div>
      <p className="text-muted text-xs mb-4">{t('scanOnMobileSub')}</p>

      <div className="flex flex-col items-center">
        <div className={`rounded-xl border p-3 ${isPlaceholder ? 'border-orange-300 bg-orange-50' : 'border-border bg-white'}`}>
          {!isPlaceholder ? (
            <QRCodeSVG value={qrUrl} size={160} level="M" includeMargin fgColor="#1a1a1a" />
          ) : (
            <div className="flex h-[160px] w-[160px] items-center justify-center text-center text-xs text-muted px-2">
              {t('qrWaitingIp')}
            </div>
          )}
        </div>

        <p className="mt-3 text-xs font-medium break-all text-center max-w-[240px] text-teal">
          {qrUrl}
        </p>

        {!isPlaceholder && (
          <button
            type="button"
            onClick={handleCopy}
            className="mt-2 inline-flex items-center gap-1 text-xs text-muted hover:text-teal"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? t('copied') : t('copyLink')}
          </button>
        )}
      </div>

      {isLocalhost && (
        <div className="mt-4 pt-4 border-t border-border space-y-3">
          {detectedIp && (
            <div className="rounded-xl bg-teal-light px-3 py-2 text-xs">
              <span className="text-muted">{t('detectedIp')}: </span>
              <span className="font-semibold text-teal">{detectedIp}</span>
              <button
                type="button"
                onClick={handleUseDetected}
                className="ml-2 font-medium text-teal underline"
              >
                {t('useThisIp')}
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={`http://172.16.x.x:${DEV_PORT}`}
              className="flex-1 min-w-0 rounded-xl border border-border px-3 py-2 text-xs outline-none focus:border-teal"
            />
            <button
              type="button"
              onClick={handleSave}
              className="shrink-0 rounded-xl bg-teal px-3 py-2 text-xs font-medium text-white hover:bg-teal-dark"
            >
              {t('saveUrl')}
            </button>
          </div>

          <button
            type="button"
            onClick={runDetection}
            disabled={detecting}
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-teal"
          >
            <RefreshCw size={14} className={detecting ? 'animate-spin' : ''} />
            {t('redetectIp')}
          </button>

          <div className="rounded-xl bg-surface border border-border p-3 space-y-2">
            <p className="text-xs font-semibold flex items-center gap-1">
              <AlertCircle size={14} className="text-orange-500" />
              {t('mobileTroubleshoot')}
            </p>
            <ol className="text-xs text-muted space-y-1 list-decimal list-inside leading-relaxed">
              <li>{t('mobileStep1')}</li>
              <li>{t('mobileStep2')}</li>
              <li>{t('mobileStep3')}</li>
              <li>{t('mobileStep4')}</li>
            </ol>
          </div>

          {serverOk === false && (
            <p className="text-xs text-red-600">{t('mobileServerBlocked')}</p>
          )}
        </div>
      )}
    </div>
  )
}
