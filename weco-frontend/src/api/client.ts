const BASE_URL = import.meta.env.VITE_API_URL

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
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  }
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 401) {
    localStorage.removeItem('token')
    window.location.replace('/login')
    throw new ApiError(401, 'Unauthorized')
  }

  return res
}
