import { apiFetch } from './client'

export interface Reward {
  id: number
  title: string
  description?: string
  image?: string
  price: number
  stock?: number
}

export async function getRewards(): Promise<Reward[]> {
  const res = await apiFetch('/rewards')
  if (!res.ok) throw new Error('Failed to fetch rewards')
  const data = await res.json()
  return Array.isArray(data) ? data : []
}

export async function redeemReward(id: number): Promise<{ ok: boolean; error?: string }> {
  const res = await apiFetch(`/rewards/${id}/redeem`, { method: 'POST' })
  if (res.status === 400 || res.status === 402) return { ok: false, error: 'not_enough_points' }
  if (!res.ok) return { ok: false, error: 'error' }
  return { ok: true }
}
