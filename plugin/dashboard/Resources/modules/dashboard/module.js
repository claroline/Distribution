
import angular from 'angular/index'
import DashboardCtrl from './Controllers/DashboardCtrl'
import DetailsCtrl from './Controllers/DetailsCtrl'
import DetailsDirective from './Directives/DetailsDirective'

angular
  .module('Dashboard', [
    'Dashboards'
  ])
  .controller('DashboardCtrl',[
    'Translator',
    'WorkspaceService',
    'DashboardService',
    'user',
    'dashboard',
    'data',
    DashboardCtrl
  ])
  .controller('DetailsCtrl',[
    DetailsCtrl
  ])
  .directive('dashboardDetails', [
    DetailsDirective
  ])
