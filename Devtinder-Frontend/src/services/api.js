import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true, // send httpOnly cookie on every request
})

// Attach requestId from response headers/body if present
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Normalize error shape: { requestId, error, status }
    const msg =
      err.response?.data?.error ||
      err.response?.data?.message ||
      err.message ||
      'Something went wrong'
    err.displayMessage = msg
    return Promise.reject(err)
  }
)
