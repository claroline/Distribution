import angular from 'angular'

import 'angular-data-table'
import 'angular-bootstrap'
import 'angular-ui-translation'
import 'angular-ui-router'
import 'angular-breadcrumb'
import 'angular-ui-tree'

import Routing from './routing.js'
import '../services/module'
import '../location/module'
import EditOrganizationModalController from './Controller/EditOrganizationModalController'
import OrganizationController from './Controller/OrganizationController'
import OrganizationAPIService from './Service/OrganizationAPIService'

angular.module('OrganizationManager', [
  'ui.router',
  'ui.tree',
  'ui.bootstrap.tpls',
  'LocationManager',
  'ui.translation',
  'ClarolineAPI',
  'ncy-angular-breadcrumb'
])
    .controller('EditOrganizationModalController', EditOrganizationModalController)
    .controller('OrganizationController', ['$http', 'OrganizationAPIService', '$uibModal', 'ClarolineAPIService', OrganizationController])
    .service('OrganizationAPIService', OrganizationAPIService)
    .config(Routing)
