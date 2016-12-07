import FieldController from '../FieldController'

export default class RichTextDirective {
  constructor ($parse, $compile) {
    this.$parse = $parse
    this.$compile = $compile
    this.scope = {}
    this.priority = 1001
    this.restrict = 'E'
    this.template = require('./rich_text.html')
    this.replace = true
    this.controller = FieldController
    this.controllerAs = 'rtc'
    this.bindToController = {
      field: '=',
      ngModel: '='
    }
  }
}
