/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import angular from 'angular/index'

export default class AdminHomeTabsConfigCtrl {

  constructor($http, HomeTabService, WidgetService) {
    this.$http = $http
    this.HomeTabService = HomeTabService
    this.WidgetService = WidgetService
    this.adminHomeTabs = HomeTabService.getAdminHomeTabs()
    this.homeTabsOptions = HomeTabService.getOptions()
    this.widgets = WidgetService.getWidgets()
    this.widgetsDisplayOptions = WidgetService.getWidgetsDisplayOptions()
    this.gridsterOptions = WidgetService.getGridsterOptions()
    this.initialize()
    this.initializeDragAndDrop()
  }

  initialize() {
    this.WidgetService.setType('admin')
    this.HomeTabService.loadAdminHomeTabs()
  }

  initializeDragAndDrop () {
    angular.element('#admin-home-tabs-list').sortable({
      items: '.home-tab',
      cursor: 'move'
    })

    angular.element('#admin-home-tabs-list').on('sortupdate', (event, ui) => {
      const hcId = $(ui.item).data('hometab-config-id')
      let nextHcId = -1
      const nextElement = $(ui.item).next()

      if (nextElement !== undefined && nextElement.hasClass('home-tab')) {
        nextHcId = nextElement.data('hometab-config-id')
      }
      const route = Routing.generate(
        'api_post_admin_home_tab_config_reorder',
        {homeTabConfig: hcId, nextHomeTabConfigId: nextHcId, homeTabType: 'desktop'}
      )
      this.$http.post(route)
    })
  }

  showTab(tabId, tabConfigId) {
    this.homeTabsOptions['selectedTabId'] = tabId
    this.homeTabsOptions['selectedTabConfigId'] = tabConfigId
    this.WidgetService.loadAdminWidgets(tabId)
  }

  createAdminHomeTab() {
    this.HomeTabService.createAdminHomeTab()
  }

  editAdminHomeTab($event, tabConfigId) {
    $event.stopPropagation()
    this.HomeTabService.editAdminHomeTab(tabConfigId)
  }

  deleteAdminHomeTab($event, tabConfigId) {
    $event.stopPropagation()
    this.HomeTabService.deleteAdminHomeTab(tabConfigId)
  }

  createAdminWidget(tabId) {
    this.WidgetService.createAdminWidget(tabId)
  }

  editAdminWidget($event, widgetInstanceId, widgetHomeTabConfigId, widgetDisplayId, configurable) {
    $event.stopPropagation()
    this.WidgetService.editAdminWidget(widgetInstanceId, widgetHomeTabConfigId, widgetDisplayId, configurable)
  }

  deleteAdminWidget($event, widgetHTCId) {
    $event.stopPropagation()
    this.WidgetService.deleteAdminWidget(widgetHTCId)
  }
}