import FieldController from './FieldController'

export default class FieldDirective {
  constructor () {
    this.scope = {}
    this.restrict = 'E'
    this.template = require('./field.html')
    this.replace = true,
    this.controller = FieldController,
    this.controllerAs = 'fic'
    this.bindToController = {
      field: '=',
      ngModel: '='
    }
  }
}
