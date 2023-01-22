import {
    axios 
} from '../lib/GlobalImports'

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL
})

export {
    axiosInstance
}