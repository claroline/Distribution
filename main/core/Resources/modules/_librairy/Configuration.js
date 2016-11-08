import config from 'clarolineconfig'

class Configuration {
  constructor (config) {
    this.config = config
  }

  getConfig () {
    return this.config
  }
}

const conf = new Configuration(config)

export default conf
