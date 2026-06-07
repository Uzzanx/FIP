import { apiFetch } from './client'

export interface VerifySession {
  id?: string
  session_id?: string
  status?: string
  is_bottle?: boolean
}

export async function getActiveSession(): Promise<VerifySession | null> {
  try {
    const res = await apiFetch('/verify/my/active')
    if (res.status === 404) return null
    if (!res.ok) return null
    const data = await res.json()
    return data ?? null
  } catch {
    return null
  }
}

export async function getVerificationSession(sessionId: string): Promise<VerifySession> {
  const res = await apiFetch(`/verify/${sessionId}`)
  if (!res.ok) throw new Error('Failed to get verification session')
  return res.json()
}

export async function startVerification(sessionId: string): Promise<void> {
  const res = await apiFetch(`/verify/${sessionId}/start`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to start verification')
}
