import { apiFetch } from './client'

export interface UserProfile {
  id: number
  username: string
  status?: string
  total_points: number
}

export interface Redemption {
  id: number
  code: string
  reward_id: number
  reward_title?: string
  reward_image?: string
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
  return Array.isArray(data) ? data : []
}
