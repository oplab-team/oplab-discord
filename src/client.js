import axios from 'axios'

const OPLAB_TOKEN = process.env.OPLAB_TOKEN
const baseURL = 'https://api.oplab.com.br/v2/'
const metabaseURL = 'https://metabase.oplab.com.br/api/'
class OplabClient {
  constructor(token) {
    this.api = axios.create({ baseURL })
    this.api.interceptors.request.use(async config => {
      config.headers['access-token'] = token || OPLAB_TOKEN
      return config
    })
  }
  async getStudies(symbols) {
    const responses = await Promise.all(
      symbols.map(s => s.toUpperCase()).map(s => this.api.get(`/studies/${s}`))
    )
    return responses.map(({ data }) => data)
  }
}

class MetabaseClient {
  constructor() {
    this.api = axios.create({ baseURL: metabaseURL })
  }
  async login(username, password) {
    const response = await this.api.post('/session', { username, password })
    this.api.interceptors.request.use(config => {
      config.headers['x-metabase-session'] = response.data.id
      return config
    })
    return response.data.id
  }

  async getCard(id) {
    const response = await this.api.get(`/card/${id}`)
    return response.data.result_metadata[0].fingerprint.type['type/Number'].avg
  }
}

export { OplabClient, MetabaseClient }
