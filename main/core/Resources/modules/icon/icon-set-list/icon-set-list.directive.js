import iconSetListTemplate from './icon-set-list.partial.html'
import iconSetListController from './icon-set-list.controller'

export default class IconSetListDirective {
  constructor() {
    this.restrict = 'E'
    this.scope = {}
    this.template = iconSetListTemplate
    this.controller  = iconSetListController
    this.controllerAs = 'vm'
    this.bindToController = true
  }
}