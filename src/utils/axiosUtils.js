import axios from 'axios'

const axiosWithPublicUrl = axios.create({
    baseURL: process.env.PUBLIC_URL
})

export default axios
export { axios, axiosWithPublicUrl }
