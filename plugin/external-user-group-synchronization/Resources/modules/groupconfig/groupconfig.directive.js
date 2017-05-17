import externalSourceGroupConfigTemplate from './groupconfig.partial.html'
import externalSourceGroupConfigController from './groupconfig.controller'

export default class ExternalSourceGroupConfigDirective {
  constructor() {
    this.restrict = 'E'
    this.scope = {}
    this.template = externalSourceGroupConfigTemplate
    this.controller  = externalSourceGroupConfigController
    this.controllerAs = 'vm'
    this.bindToController = true
  }
}