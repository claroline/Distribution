import FileController from './FileController'

export default class FileDirective {
  constructor ($parse, $compile) {
    this.$parse = $parse
    this.$compile = $compile
    this.scope = {}
    this.priority = 1001
    this.restrict = 'E'
    this.template = require('./file.html')
    this.replace = true
    this.controller = FileController
    this.controllerAs = 'fc'
    this.bindToController = {
      field: '=',
      ngModel: '='
    }
  }
/*
  compile (tElem, tAttrs) {
    return this.postLinkFn.bind(this)
}*/

  //http://stackoverflow.com/questions/18571001/file-upload-using-angularjs
  //it doesn't look good. We'll have to find a much robust way to handle file uploads with angular
  postLinkFn (scope, element, attrs) {
      element.bind("change", event => {
          console.log(event)
          const file = event.target.files[0]
          //lol
          console.log(this)
          const reader = new FileReader()
          reader.onloadend = e => {
           var data = e.target.result;
           this.$parse(attrs.ngModel).assign(scope, data)
           //send you binary data via $http or $resource or do anything else with it
         }
          reader.readAsBinaryString(file);
      })
 }
}
