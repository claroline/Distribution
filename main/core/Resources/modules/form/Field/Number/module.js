import angular from 'angular'

import 'angular-ui-translation'
import NumberDirective from './NumberDirective'

angular.module('FieldNumber', ['ui.translation']).directive('formNumber', () => new NumberDirective)
