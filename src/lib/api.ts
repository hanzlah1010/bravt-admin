import axios from "axios"

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true
})

api.interceptors.request.use(
  (request) => {
    const accessToken = localStorage.getItem("access_token")
    if (accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`
    }
    return request
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        )

        localStorage.setItem("access_token", data.token)
        api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`
        return api(originalRequest)
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError)
        localStorage.removeItem("access_token")
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)
