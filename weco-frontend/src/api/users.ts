import { apiFetch, resolveApiUrl } from './client'

export interface UserProfile {
  id: number
  username: string
  status?: string
  total_points: number
}

export interface Redemption {
  id: string
  code: string
  reward_id: number
  reward_title?: string
  reward_image?: string
  reward_image_url?: string
  reward_description?: string
  created_at: string
  expires_at: string
  is_used: boolean
}

type RedemptionApiItem = {
  id: string
  code: string
  reward_id: number
  reward_title?: string
  reward_image?: string
  reward_image_url?: string
  reward_description?: string
  created_at: string
  expires_at: string
  is_used: boolean
}

export async function getMe(): Promise<UserProfile> {
  const res = await apiFetch('/users/me')
  if (!res.ok) throw new Error('Failed to fetch profile')
  return res.json()
}

export async function getQRObjectUrl(): Promise<string> {
  const res = await apiFetch('/users/me/qr.png')
  if (!res.ok) throw new Error('QR unavailable')
  const blob = await res.blob()
  return URL.createObjectURL(blob)
}

export async function getRedemptions(): Promise<Redemption[]> {
  const res = await apiFetch('/users/me/redemptions')
  if (!res.ok) throw new Error('Failed to fetch redemptions')
  const data = await res.json()
  return Array.isArray(data)
    ? (data as RedemptionApiItem[]).map((item) => ({
        ...item,
        id: String(item.id),
        reward_image: resolveApiUrl(item.reward_image ?? item.reward_image_url),
        reward_image_url: item.reward_image_url ?? item.reward_image,
        is_used: Boolean(item.is_used),
      }))
    : []
}
