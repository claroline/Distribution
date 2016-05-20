import 'angular/angular.min'
import 'angular-bootstrap'

import translation from 'angular-ui-translation/angular-translation'
import FileDirective from './FileDirective'
import FileModelDirective from './FileModelDirective'

angular.module('FieldFile', [
  'ui.translation',
  'ui.bootstrap'
])
  .directive('formFile', () => new FileDirective)
  .directive('fileModel', ['$parse', ($parse) => new FileModelDirective($parse)])
