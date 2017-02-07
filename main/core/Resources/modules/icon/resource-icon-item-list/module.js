import angular from 'angular/index'
import {} from '../../modal/module'
import {} from 'angular-loading-bar'
import {} from 'ng-file-upload'
import {} from 'angular-ui-translation/angular-translation'
import {} from '../../fos-js-router/module'
import {} from '../../asset/module'
import register from '../../register/register'
import resourceIconItemList from './resource-icon-item-list.directive'
import resourceIconItemService from './resource-icon-item-list.service'

let resourceIconItemListApp =  new register(
  'resourceIconItemListApp',
  [
    'angular-loading-bar',
    'ngFileUpload',
    'ui.modal',
    'ui.asset',
    'ui.bootstrap',
    'ui.fos-js-router',
    'ui.translation'
  ])

resourceIconItemListApp
  .directive('resourceIconItemList', resourceIconItemList)
  .service('resourceIconItemService', resourceIconItemService)
  .value('iconSet', window.iconSet)
  .value('iconItemsByTypes', window.iconItemsByTypes)

//Bootstrap angular in body
angular.element(document).ready(function() {
  angular.bootstrap(document.getElementsByTagName('body')[ 0 ], [ 'resourceIconItemListApp' ])
})