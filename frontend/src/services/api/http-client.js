const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'
const DEFAULT_TIMEOUT_MS = 30000

export async function apiRequest(path, options = {}) {
  const isFormData = options.body instanceof FormData
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), options.timeout ?? DEFAULT_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: isFormData
        ? { ...options.headers }
        : {
            'Content-Type': 'application/json',
            ...options.headers,
          },
      ...options,
      signal: options.signal ?? controller.signal,
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    return response.json()
  } finally {
    window.clearTimeout(timeout)
  }
}
