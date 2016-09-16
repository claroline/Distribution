
import angular from 'angular/index'
import '#/main/core/fos-js-router/module'

import DashboardService from './Services/DashboardService'
import DashboardsCtrl from './Controllers/DashboardsCtrl'

angular
  .module('Dashboards', [])
  .controller('DashboardsCtrl', [
    'user',
    'dashboards',
    DashboardsCtrl
  ])
  .service('DashboardService', [
    '$http',
    '$q',
    'url',
    DashboardService
  ])
