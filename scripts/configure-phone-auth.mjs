/**
 * Ensures Firebase Phone Auth can send OTP to Indian numbers and
 * authorizes all Indur hosting domains.
 *
 * Run: node configure-phone-auth.mjs
 */
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const projectId = 'nizamabad-698d9'
const dir = dirname(fileURLToPath(import.meta.url))

function getAccessToken() {
  return execSync(`gcloud auth print-access-token --project=${projectId}`, { encoding: 'utf8' }).trim()
}

async function patchConfig(updateMask, payloadFile) {
  const token = getAccessToken()
  const body = readFileSync(join(dir, payloadFile), 'utf8')
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v2/projects/${projectId}/config?updateMask=${updateMask}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'x-goog-user-project': projectId,
      },
      body,
    },
  )
  const text = await res.text()
  if (!res.ok) throw new Error(`${updateMask} failed: ${res.status} ${text}`)
  return JSON.parse(text)
}

console.log(`Configuring phone auth for ${projectId}...`)

await patchConfig('smsRegionConfig', 'sms-region-patch.json')
console.log('  SMS region: India (IN) allowed')

await patchConfig('authorizedDomains', 'auth-domains-patch.json')
console.log('  Authorized domains updated')

console.log('\nDone. Phone provider must stay enabled in Firebase Console.')
console.log('Real SMS OTP requires Blaze billing: https://console.firebase.google.com/project/nizamabad-698d9/usage/details')
console.log('Test OTP without SMS: +919505442525 → 123456')
