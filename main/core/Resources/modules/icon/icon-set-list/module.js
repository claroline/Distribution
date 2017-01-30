import angular from 'angular/index'
import {} from '../../modal/module'
import {} from 'angular-loading-bar'
import {} from 'angular-ui-translation/angular-translation'
import {} from '../../fos-js-router/module'
import {} from '../../asset/module'
import register from '../../register/register'
import iconSetList from './icon-set-list.directive'
import iconSetService from './icon-set-list.service'

let iconSetListApp =  new register(
  'iconSetListApp',
  [
    'angular-loading-bar',
    'ui.modal',
    'ui.asset',
    'ui.bootstrap',
    'ui.fos-js-router',
    'ui.translation'
  ])

iconSetListApp
  .directive('iconSetList', iconSetList)
  .service('iconSetService', iconSetService)
  .value('iconSets', window.iconSets)

//Bootstrap angular in body
angular.element(document).ready(function() {
  angular.bootstrap(document.getElementsByTagName('body')[ 0 ], [ 'iconSetListApp' ])
})