import axios from "axios"

const url = "http://127.0.0.1:8000"

export const API = axios.create({
  baseURL: `${url}/api`,
})

export const bookImageStorage = `${url}/storage/tasks/`
export const userImageStorage = `${url}/storage/users/`

export default API
