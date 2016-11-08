import config from 'clarolineconfig'

class Configuration {
  constructor (config) {
    this.config = config
  }

  getConfig () {
    return this.config
  }

  get (path) {
    const values = []
    const parts = path.split('.')

    for (var key in this.config) {
      let value = this.config[key]
      parts.forEach(part => {
        value = value[part]
        //improve this to handle array
      })
      values.push(value)
    }

    return values
  }

  walk () {}
}

const conf = new Configuration(config)

export default conf
