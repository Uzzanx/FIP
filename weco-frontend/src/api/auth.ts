import { apiFetch } from './client'

export async function register(username: string, password: string): Promise<void> {
  const res = await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    throw new Error(data?.detail ?? 'Registration failed')
  }
}

export async function login(username: string, password: string): Promise<string> {
  const res = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  if (res.status === 401 || res.status === 400) throw new Error('invalid_credentials')
  if (!res.ok) throw new Error('Login failed')
  const data = await res.json()
  return data.access_token as string
}
