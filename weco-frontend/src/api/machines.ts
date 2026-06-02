import { BASE_URL, resolveApiUrl } from './client'

export interface Machine {
  id: string
  name: string
  title?: string
  address?: string
  lat: number
  lng: number
  image?: string
  photo_url?: string
  bottles_collected?: number
}

export interface PickupLocation {
  id: number
  name: string
  title?: string
  address?: string
  lat: number
  lng: number
  image?: string
  photo_url?: string
}

type MachineApiItem = {
  id: string
  name?: string
  title?: string
  address?: string
  lat: number
  lng: number
  image?: string
  photo_url?: string
  bottles_collected?: number
}

type PickupLocationApiItem = {
  id: number
  name?: string
  title?: string
  address?: string
  lat: number
  lng: number
  image?: string
  photo_url?: string
}

function normalizeListImage(image?: string | null): string | undefined {
  return resolveApiUrl(image)
}

export async function getMachines(): Promise<Machine[]> {
  try {
    const res = await fetch(`${BASE_URL}/machines`)
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data)
      ? (data as MachineApiItem[]).map((item) => ({
          ...item,
          name: item.name ?? item.title ?? '',
          title: item.title ?? item.name,
          image: normalizeListImage(item.image ?? item.photo_url),
          photo_url: item.photo_url ?? item.image,
        }))
      : []
  } catch {
    return []
  }
}

export async function getPickupLocations(): Promise<PickupLocation[]> {
  try {
    const res = await fetch(`${BASE_URL}/pickup-locations`)
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data)
      ? (data as PickupLocationApiItem[]).map((item) => ({
          ...item,
          name: item.name ?? item.title ?? '',
          title: item.title ?? item.name,
          image: normalizeListImage(item.image ?? item.photo_url),
          photo_url: item.photo_url ?? item.image,
        }))
      : []
  } catch {
    return []
  }
}
