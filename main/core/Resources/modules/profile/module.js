import 'angular/angular.min'

import 'angular-bootstrap'
import 'angular-ui-translation/angular-translation'
import '../asset/module'

import Interceptors from '../interceptorsDefault'
import ProfileDirective from './Directive/ProfileDirective'
import '../form/module'
import '../services/module'

angular.module('UserProfile', [
  'ui.bootstrap',
  'ui.translation',
  'ClarolineAPI',
  'ui.asset',
  'FormBuilder'
])
  .directive('userProfile', () => new ProfileDirective)
  .config(Interceptors)
