
import angular from 'angular/index'

import 'angular-bootstrap'
import 'angular-strap'
import 'angular-ui-translation/angular-translation'
import '#/main/core/modal/module'
import '#/main/core/fos-js-router/module'
import '#/main/core/translation/module'

import './../dashboards/module'

import StepOne from './Directives/StepOneDirective'
import StepOneCtrl from './Controllers/StepOneCtrl'
import CreateDashboardCtrl from './Controllers/CreateDashboardCtrl'

angular
  .module('Create', [
    'ngRoute',
    'ui.translation',
    'ui.bootstrap',
    'ui.modal',
    'mgcrea.ngStrap.datepicker',
    'translation',
    'Dashboards'
  ])
  .controller('CreateDashboardCtrl', [
    '$location',
    'DashboardService',
    'workspaces',
    'user',
    'nbDashboards',
    CreateDashboardCtrl
  ])
  .controller('StepOneCtrl',[
    'Translator',
    'DashboardService',
    StepOneCtrl
  ])
  .directive('stepOne', [
    StepOne
  ])
