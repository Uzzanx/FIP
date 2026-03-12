import { apiFetch } from './client'

export interface PreviewResult {
  reward_title?: string
  reward_image?: string
  username?: string
  expires_at?: string
  stock?: number
  can_claim?: boolean
}

export async function previewRedemption(
  staffKey: string,
  locationId: number,
  code: string
): Promise<{ ok: boolean; data?: PreviewResult; error?: string }> {
  const res = await apiFetch(
    '/staff/redemptions/preview',
    { method: 'POST', body: JSON.stringify({ location_id: locationId, code }) },
    { 'X-STAFF-KEY': staffKey }
  )
  if (res.status === 404) return { ok: false, error: 'Code not found.' }
  if (res.status === 409) return { ok: false, error: 'Code already used.' }
  if (res.status === 410) return { ok: false, error: 'Code has expired.' }
  if (!res.ok) return { ok: false, error: 'Preview failed.' }
  const data = await res.json()
  return { ok: true, data }
}

export async function claimRedemption(
  staffKey: string,
  locationId: number,
  code: string
): Promise<{ ok: boolean; error?: string }> {
  const res = await apiFetch(
    '/staff/redemptions/claim',
    { method: 'POST', body: JSON.stringify({ location_id: locationId, code }) },
    { 'X-STAFF-KEY': staffKey }
  )
  if (res.status === 404) return { ok: false, error: 'Code not found.' }
  if (res.status === 409) {
    const data = await res.json().catch(() => null)
    const msg: string = data?.detail ?? ''
    if (msg.toLowerCase().includes('stock')) return { ok: false, error: 'Out of stock at this location.' }
    return { ok: false, error: 'Code already used.' }
  }
  if (res.status === 410) return { ok: false, error: 'Code has expired.' }
  if (!res.ok) return { ok: false, error: 'Claim failed.' }
  return { ok: true }
}
