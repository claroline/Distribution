
import angular from 'angular/index'
import DashboardCtrl from './Controllers/DashboardCtrl'

angular
  .module('Dashboard', [
    'translation',
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
