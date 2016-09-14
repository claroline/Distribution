import angular from 'angular/index'

import 'angular-route'
import 'angular-loading-bar'
import 'angular-strap'
import '#/main/core/fos-js-router/module'
import '#/main/core/workspace/module'
import '#/main/core/users/module'

import './dashboards/module'

import dashboards from './dashboards/Partials/dashboards.html'
import DashboardsCtrl from './dashboards/Controllers/DashboardsCtrl'

import CreateDashboardCtrl from './create/Controllers/CreateDashboardCtrl'
import add from './create/Partials/add.html'

angular
  // Declare the new Application
    .module('DashboardApp', [
      'ngRoute',
      'angular-loading-bar',
      'ui.fos-js-router',
      'mgcrea.ngStrap.datepicker',
      'Dashboards',
      'workspace',
      'UsersManager'
    ])
    // Configure application
    .config([
      '$routeProvider',
      'cfpLoadingBarProvider',
      '$datepickerProvider',
      function DashboardAppConfig($routeProvider, cfpLoadingBarProvider, $datepickerProvider) {
        // Configure loader
        cfpLoadingBarProvider.latencyThreshold = 200
        cfpLoadingBarProvider.includeBar       = false
        cfpLoadingBarProvider.spinnerTemplate  = '<div class="loading">Loading&#8230;</div>'

        // Configure DatePicker
        angular.extend($datepickerProvider.defaults, {
          dateFormat: 'dd/MM/yyyy',
          dateType: 'string',
          startWeek: 1,
          iconLeft: 'fa fa-fw fa-chevron-left',
          iconRight: 'fa fa-fw fa-chevron-right',
          modelDateFormat: 'yyyy-MM-dd\THH:mm:ss',
          autoclose: true
        })

        // Define routes
        $routeProvider
          // Dahsboards list
          .when('/', {
            template: dashboards,
            controller  : DashboardsCtrl,
            controllerAs: 'dashboardsCtrl',
            resolve: {
              dashboards: [
                'DashboardService',
                function dashboardsResolve(DashboardService) {
                  return DashboardService.getAll()
                }
              ]
            }
          })
          .when('/new', {
            template: add,
            controller  : CreateDashboardCtrl,
            controllerAs: 'createDashboardCtrl',
            resolve: {
              workspaces: [
                'WorkspaceService',
                function workspacesResolve(WorkspaceService) {
                  // retrive user id from url ???
                  return WorkspaceService.getUserWorkspaces(2)
                }
              ],
              user:[
                'UserAPIService',
                function userResolve(UserAPIService) {
                  // retrive user id from url ???
                  return UserAPIService.getConnectedUser()
                }
              ]
            }
          })
          // Otherwise redirect User on Overview
          .otherwise({
            redirectTo: '/'
          })
      }
    ])
