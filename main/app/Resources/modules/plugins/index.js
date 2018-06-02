import {param} from '#/main/app/config'
import {registry} from '#/main/app/plugins/registry'

function getRegistered(key) {
  const enabled = param('plugins')
  const plugins = registry.all()
}

export {
  getRegistered
}
