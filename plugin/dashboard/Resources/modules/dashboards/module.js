
import angular from 'angular/index'
import '#/main/core/modal/module'
import '#/main/core/fos-js-router/module'

import DashboardService from './Services/DashboardService'

angular
  .module('Dashboards', [])
  .service('DashboardService', [
    '$http',
    '$q',
    'url',
    DashboardService
  ])
