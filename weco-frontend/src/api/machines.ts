const BASE_URL = import.meta.env.VITE_API_URL

export interface Machine {
  id: number
  name: string
  address?: string
  lat: number
  lng: number
  image?: string
}

export interface PickupLocation {
  id: number
  name: string
  address?: string
  lat: number
  lng: number
  image?: string
}

export async function getMachines(): Promise<Machine[]> {
  try {
    const res = await fetch(`${BASE_URL}/machines`)
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export async function getPickupLocations(): Promise<PickupLocation[]> {
  try {
    const res = await fetch(`${BASE_URL}/pickup-locations`)
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}
