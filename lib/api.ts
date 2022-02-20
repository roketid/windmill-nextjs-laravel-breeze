import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL

const instance = axios.create({
   withCredentials: true,
   headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
   baseURL: baseURL
})

export const csrf = () => instance.get(baseURL + '/sanctum/csrf-cookie')

export default instance
