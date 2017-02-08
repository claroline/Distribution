import angular from 'angular'
import 'angular-bootstrap'

import 'angular-ui-translation'
import FileDirective from './FileDirective'
import FileModelDirective from './FileModelDirective'
import '../../HelpBlock/module'

angular.module('FieldFile', [
  'ui.translation',
  'ui.bootstrap',
  'HelpBlock'
])
  .directive('formFile', () => new FileDirective)
  .directive('fileModel', ['$parse', ($parse) => new FileModelDirective($parse)])
