import externalSourceUserConfigTemplate from './userconfig.partial.html'
import externalSourceUserConfigController from './userconfig.controller'

export default class ExternalSourceUserConfigDirective {
  constructor() {
    this.restrict = 'E'
    this.scope = {}
    this.template = externalSourceUserConfigTemplate
    this.controller  = externalSourceUserConfigController
    this.controllerAs = 'vm'
    this.bindToController = true
  }
}