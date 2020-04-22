import dotenv from 'dotenv'
dotenv.config()

import axios from 'axios'

const OPLAB_TOKEN = process.env.OPLAB_TOKEN
const baseURL = 'https://api.oplab.com.br/v2/'
class OplabClient {
    constructor(token){
        this.api = axios.create({ baseURL })
        this.api.interceptors.request.use(async config => {
            config.headers['access-token'] = token || OPLAB_TOKEN
            return config
          })
    }
    async getStudies(symbols){
        const responses = await Promise.all(symbols.map(s => s.toUpperCase()).map(s => this.api.get(`/studies/${s}`)))
        return responses.map(({data}) => data)
    }
}

export default OplabClient