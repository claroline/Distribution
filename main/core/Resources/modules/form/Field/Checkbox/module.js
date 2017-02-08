import angular from 'angular'

import 'angular-ui-translation'
import CheckboxDirective from './CheckboxDirective'

angular.module('FieldCheckbox', ['ui.translation']).directive('formCheckbox', () => new CheckboxDirective)
