/**
 * Resources primary show controller
 */

import angular from 'angular/index'

import ResourcesPrimaryBaseCtrl from './ResourcesPrimaryBaseCtrl'

export default class ResourcesPrimaryShowCtrl extends ResourcesPrimaryBaseCtrl {
  constructor(url, ResourceService) {
    super(url, ResourceService)

    if (angular.isObject(this.resources) && angular.isObject(this.resources[0])) {
      new Pjax({
        elements: [], // default is "a[href], form[action]"
        selectors: ["title", ".my-Header", ".my-Content", ".my-Sidebar"]
      }).loadUrl(
        this.UrlGenerator('claro_resource_open', {
          node: this.resources[0].id,
          resourceType: this.resources[0].type
        }) + '?iframe=1'
      )
    }
  }
}
