import { apiFetch } from './client'

export interface VerifySession {
  session_id: string
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

export async function startVerification(sessionId: string): Promise<void> {
  await apiFetch(`/verify/${sessionId}/start`, { method: 'POST' })
}
