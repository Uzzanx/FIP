export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export function resolveApiUrl(value?: string | null): string | undefined {
  if (!value) return undefined
  if (/^https?:\/\//i.test(value)) return value
  const normalizedPath = value.startsWith('/') ? value : `/${value}`
  return `${BASE_URL}${normalizedPath}`
}

export class ApiError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export async function apiFetch(
  path: string,
  options: RequestInit = {},
  extraHeaders: Record<string, string> = {}
): Promise<Response> {
  const token = localStorage.getItem('token')
  const headers = new Headers(options.headers)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  for (const [key, value] of Object.entries(extraHeaders)) {
    headers.set(key, value)
  }

  if (options.body !== undefined) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  const isAuthRequest = path.startsWith('/auth/login') || path.startsWith('/auth/register')

  if (res.status === 401 && !isAuthRequest) {
    localStorage.removeItem('token')
    window.location.replace('/login')
    throw new ApiError(401, 'Unauthorized')
  }

  return res
}
