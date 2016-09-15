
import angular from 'angular/index'

import 'angular-bootstrap'
import 'angular-strap'
import 'angular-ui-translation/angular-translation'
import '#/main/core/modal/module'
import '#/main/core/fos-js-router/module'
import '#/main/core/translation/module'

import StepOne from './Directives/StepOneDirective'
import StepOneCtrl from './Controllers/StepOneCtrl'

angular
  .module('Create', [
    'ui.translation',
    'ui.bootstrap',
    'ui.modal',
    'mgcrea.ngStrap.datepicker',
    'translation'
  ])
  .controller('StepOneCtrl',[
    'Translator',
    StepOneCtrl
  ])
  .directive('stepOne', [
    StepOne
  ])
