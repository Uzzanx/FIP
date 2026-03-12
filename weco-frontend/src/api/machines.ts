const BASE_URL = 'http://127.0.0.1:8000'

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
