// Central API base URL for all frontend API calls
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  (window as unknown as { API_BASE_URL?: string }).API_BASE_URL ||
  'http://localhost:8000'
