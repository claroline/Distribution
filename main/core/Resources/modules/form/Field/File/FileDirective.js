import FileController from './FileController'

export default class FileDirective {
  constructor () {
    this.scope = {}
    this.restrict = 'E'
    this.template = require('./file.html')
    this.replace = true,
    this.controller = FileController
    this.controllerAs = 'fc'
    this.bindToController = {
      field: '=',
      ngModel: '='
    }
  }
}
