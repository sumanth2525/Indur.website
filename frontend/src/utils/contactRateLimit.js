const STORAGE_KEY = 'indur_contact_log'

function readLog() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeLog(log) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(log))
}

export function canContact(key, cooldownMs = 3000) {
  const log = readLog()
  const last = log[key] || 0
  return Date.now() - last >= cooldownMs
}

export function recordContact(key) {
  const log = readLog()
  log[key] = Date.now()
  writeLog(log)
}
