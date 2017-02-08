import angular from 'angular'
import 'angular-bootstrap'

import 'angular-ui-translation'
import EmailDirective from './EmailDirective'
import '../../HelpBlock/module'

angular.module('FieldEmail', [
  'ui.translation',
  'ui.bootstrap',
  'HelpBlock'
])
  .directive('formEmail', () => new EmailDirective)
