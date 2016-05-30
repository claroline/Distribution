import angular from 'angular/index'
import {} from 'angular-route'
import {} from 'angular-animate'
import {} from 'angular-loading-bar'
import {} from '../common/claro-filters'
import {} from 'angular-bootstrap'
import portalSearch from './portal-search/portal-search.directive'
import portalService from './portal.service'
import register from '../common/register'
import router from './routing'

let portalApp = new register(
  'portalApp',
  [
    'claroFilters',
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'angular-loading-bar'
  ]);

portalApp
  .config(router)
  .directive('portalSearch', portalSearch)
  .service('portalService', portalService)
  .filter('resourcePath', ['$filter', $filter => resource => {
    if (resource.resourceType == 'directory') {
      return $filter('path')('claro_workspace_open_tool', {'workspaceId': resource.workspaceId, 'toolName': 'home'})
    } else {
      return $filter('path')('claro_resource_open_short', {'node': resource.id})
    }
  }])

//Bootstrap angular in body
angular.element(document).ready(function () {
  angular.bootstrap(document.getElementsByTagName('body')[ 0 ], [ 'portalApp' ]);
})