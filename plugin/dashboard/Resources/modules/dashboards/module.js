
import angular from 'angular/index'

import 'angular-bootstrap'
import 'angular-strap'
import 'angular-ui-translation/angular-translation'
import '#/main/core/modal/module'
import '#/main/core/fos-js-router/module'

//import DashboardsCtrl from './Controllers/DashboardsCtrl'
import DashboardService from './Services/DashboardService'
//import DashboardsDirective from './Directives/DashboardsDirective'

angular
  .module('Dashboards', [
    'ui.translation',
    'ui.bootstrap',
    'ui.modal',
    'mgcrea.ngStrap.datepicker'
  ])/*
  .controller('DashboardsCtrl', [
    'DashboardService',
    '$route',
    DashboardsCtrl
  ])
  .directive('dashboards', [
    DashboardsDirective
  ])*/
  .service('DashboardService', [
    '$http',
    '$q',
    'url',
    DashboardService
  ])
