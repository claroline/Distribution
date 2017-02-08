import angular from 'angular'

import 'angular-ui-translation'
import RadioDirective from './RadioDirective'

angular.module('FieldRadio', ['ui.translation']).directive('formRadio', () => new RadioDirective)
