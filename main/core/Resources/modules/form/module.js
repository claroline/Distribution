import 'angular/angular.min'
import translation from 'angular-ui-translation/angular-translation'

import './Field/Checkbox/module'
import './Field/Checkboxes/module'
import './Field/Select/module'
import './Field/Text/module'

import FormDirective from './FormDirective'
import FormBuilderService from './FormBuilderService'
import FieldDirective from './FieldDirective'

angular.module('FormBuilder', [
  'ui.translation',
  'FieldCheckbox',
  'FieldCheckboxes',
  'FieldSelect',
  'FieldText'
])
  .directive('formbuilder', () => new FormDirective)
  .directive('formField', () => new FieldDirective)
  .service('FormBuilderService', FormBuilderService)
