import angular from 'angular/index'

import 'angular-route'
import 'angular-loading-bar'
import 'angular-strap'
import '#/main/core/fos-js-router/module'
import '#/main/core/workspace/module'
import '#/main/core/authentication/module'
import '#/main/core/translation/module'

import './dashboards/module'
import './dashboard/module'
import './create/module'

import dashboards from './dashboards/Partials/dashboards.html'


import add from './create/Partials/add.html'

import dashboard from './dashboard/Partials/dashboard.html'

angular
  // Declare the new Application
    .module('DashboardApp', [
      'ngRoute',
      'angular-loading-bar',
      'ui.fos-js-router',
      'mgcrea.ngStrap.datepicker',
      'Dashboards',
      'workspace',
      'authentication',
      'translation',
      'Create',
      'Dashboard'
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
            controller  : 'DashboardsCtrl',
            controllerAs: 'dashboardsCtrl',
            resolve: {
              user:[
                'UserService',
                function userResolve(UserService) {
                  return UserService.getConnectedUser()
                }
              ],
              dashboards: [
                'DashboardService',
                function dashboardsResolve(DashboardService) {
                  return DashboardService.getAll()
                }
              ]
            }
          })
          .when('/dashboards/:id', {
            template: dashboard,
            controller  : 'DashboardCtrl',
            controllerAs: 'dashboardCtrl',
            resolve: {
              user:[
                'UserService',
                function userResolve(UserService) {
                  return UserService.getConnectedUser()
                }
              ],
              dashboard: [
                '$route',
                'DashboardService',
                function dashboardResolve($route, DashboardService) {
                  var promise = null
                  if ($route.current.params && $route.current.params.id) {
                    promise = DashboardService.getOne($route.current.params.id)
                  }

                  return promise
                }
              ],
              data:[
                '$route',
                'DashboardService',
                function dashboardResolve($route, DashboardService) {
                  var promise = null
                  if ($route.current.params && $route.current.params.id) {
                    promise = DashboardService.getDashboardData($route.current.params.id)
                  }

                  return promise
                }
              ]
            }
          })
          .when('/new', {
            template: add,
            controller  : 'CreateDashboardCtrl',
            controllerAs: 'createDashboardCtrl',
            resolve: {
              user:[
                'UserService',
                function userResolve(UserService) {
                  return UserService.getConnectedUser()
                }
              ],
              workspaces: [
                'WorkspaceService',
                function workspacesResolve(WorkspaceService) {
                  return WorkspaceService.getUserWorkspaces()
                }
              ],
              nbDashboards:[
                'DashboardService',
                function nbDashboardResolve(DashboardService) {
                  return DashboardService.countDashboards()
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
