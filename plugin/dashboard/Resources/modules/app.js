import angular from 'angular/index'

import 'angular-route'
import 'angular-loading-bar'
import 'angular-strap'
import '#/main/core/fos-js-router/module'
import '#/main/core/workspace/module'
import '#/main/core/authentication/module'
import '#/main/core/translation/module'

import './dashboards/module'
import './create/module'

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
      'authentication',
      'translation',
      'Create'
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
          .when('/new', {
            template: add,
            controller  : CreateDashboardCtrl,
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
              Translator: [
                'Translator',
                function workspacesResolve(Translator) {
                  return Translator
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
