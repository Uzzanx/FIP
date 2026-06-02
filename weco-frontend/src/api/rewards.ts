import { apiFetch, resolveApiUrl } from './client'

export interface Reward {
  id: number
  title: string
  description?: string
  image?: string
  image_url?: string
  price: number
  points_cost?: number
  stock?: number
  is_active?: boolean
  created_at?: string
}

type RewardApiItem = {
  id: number
  title: string
  description?: string
  image?: string
  image_url?: string
  price?: number
  points_cost?: number
  stock?: number
  is_active?: boolean
  created_at?: string
}

export async function getRewards(): Promise<Reward[]> {
  const res = await apiFetch('/rewards')
  if (!res.ok) throw new Error('Failed to fetch rewards')
  const data = await res.json()
  return Array.isArray(data)
    ? (data as RewardApiItem[]).map((item) => ({
        ...item,
        price: item.price ?? item.points_cost ?? 0,
        points_cost: item.points_cost ?? item.price,
        image: resolveApiUrl(item.image ?? item.image_url),
        image_url: item.image_url ?? item.image,
      }))
    : []
}

export async function redeemReward(id: number): Promise<{ ok: boolean; error?: string }> {
  const res = await apiFetch(`/rewards/${id}/redeem`, { method: 'POST' })
  if (res.status === 400 || res.status === 402) return { ok: false, error: 'not_enough_points' }
  if (!res.ok) return { ok: false, error: 'error' }
  return { ok: true }
}
