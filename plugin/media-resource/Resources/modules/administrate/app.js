import angular from 'angular/index'
import 'angular-loading-bar'
import 'angular-strap'
import 'angular-route'
import 'angular-ui-translation/angular-translation'
import '#/main/core/fos-js-router/module'
import '#/main/core/modal/module'
import '../shared/module'
import '../modals/module'

import AdminCtrl from './Controllers/AdminCtrl'
import AdminService from './Services/AdminService'
import adminTpl from './Partials/admin.html'

let adminApp = angular.module('AdminApp', [
  'ngRoute',
  'angular-loading-bar',
  'ui.translation',
  'ui.fos-js-router',
  'ui.modal',
  'Shared',
  'Modals'
])

adminApp.config([
  'cfpLoadingBarProvider',
  function adminAppConfig(cfpLoadingBarProvider) {
        // Configure loader
    cfpLoadingBarProvider.latencyThreshold = 200
    cfpLoadingBarProvider.includeBar       = false
    cfpLoadingBarProvider.spinnerTemplate  = '<div class="loading">Loading&#8230;</div>'
  }
])

// main admin comp
adminApp.component('admin', {
  template: adminTpl,
  bindings: {
    resource: '='
  },
  controller: AdminCtrl
})



adminApp.service('AdminService', [
  '$http',
  '$q',
  'url',
  AdminService
])
