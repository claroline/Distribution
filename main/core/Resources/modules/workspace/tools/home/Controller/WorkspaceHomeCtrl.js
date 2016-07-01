/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/*global Routing*/
import angular from 'angular/index'
import $ from 'jquery/dist/jquery'

export default class WorkspaceHomeCtrl {

  constructor($http, HomeTabService, WidgetService) {
    this.$http = $http
    this.HomeTabService = HomeTabService
    this.WidgetService = WidgetService
    this.workspaceHomeTabs = HomeTabService.getWorkspaceHomeTabs()
    this.homeTabsOptions = HomeTabService.getOptions()
    this.widgets = WidgetService.getWidgets()
    this.widgetsOptions = WidgetService.getOptions()
    this.widgetsDisplayOptions = WidgetService.getWidgetsDisplayOptions()
    this.gridsterOptions = WidgetService.getGridsterOptions()
    this.initialize()
    this.initializeDragAndDrop()
  }

  initialize() {
    this.homeTabsOptions['workspaceId'] = WorkspaceHomeCtrl._getGlobal('workspaceId')
    this.homeTabsOptions['canEdit'] = WorkspaceHomeCtrl._getGlobal('canEdit')
    this.widgetsOptions['canEdit'] = WorkspaceHomeCtrl._getGlobal('canEdit')
    this.WidgetService.setType('workspace')
    this.HomeTabService.loadWorkspaceHomeTabs()
  }

  initializeDragAndDrop () {
    angular.element('#workspace-home-tabs-list').sortable({
      items: '.home-tab',
      cursor: 'move'
    })

    angular.element('#workspace-home-tabs-list').on('sortupdate', (event, ui) => {
      const hcId = $(ui.item).data('hometab-config-id')
      let nextHcId = -1
      const nextElement = $(ui.item).next()

      if (nextElement !== undefined && nextElement.hasClass('home-tab')) {
        nextHcId = nextElement.data('hometab-config-id')
      }
      const route = Routing.generate(
        'api_post_workspace_home_tab_config_reorder',
        {homeTabConfig: hcId, nextHomeTabConfigId: nextHcId}
      )
      this.$http.post(route)
    })
  }

  showTab(tabId, tabConfigId) {
    this.homeTabsOptions['selectedTabId'] = tabId
    this.homeTabsOptions['selectedTabConfigId'] = tabConfigId
    this.WidgetService.loadWorkspaceWidgets(tabId)
  }

  createWorkspaceHomeTab() {
    this.HomeTabService.createWorkspaceHomeTab()
  }

  editWorkspaceHomeTab($event, tabConfigId) {
    $event.stopPropagation()
    this.HomeTabService.editWorkspaceHomeTab(tabConfigId)
  }

  deleteWorkspaceHomeTab($event, tabConfigId) {
    $event.stopPropagation()
    this.HomeTabService.deleteWorkspaceHomeTab(tabConfigId)
  }

  pinWorkspaceHomeTab($event, tabConfigId) {
    $event.stopPropagation()
    this.HomeTabService.pinWorkspaceHomeTab(tabConfigId)
  }

  createWorkspaceWidget(tabId) {
    this.WidgetService.createWorkspaceWidget(tabId)
  }

  editWorkspaceWidget($event, widgetInstanceId, widgetHomeTabConfigId, widgetDisplayId, configurable) {
    $event.stopPropagation()
    this.WidgetService.editWorkspaceWidget(widgetInstanceId, widgetHomeTabConfigId, widgetDisplayId, configurable)
  }

  deleteWorkspaceWidget($event, widgetHTCId) {
    $event.stopPropagation()
    this.WidgetService.deleteWorkspaceWidget(widgetHTCId)
  }

  static _getGlobal (name) {
    if (typeof window[name] === 'undefined') {
      throw new Error(
        `Expected ${name} to be exposed in a window.${name} variable`
      )
    }

    return window[name]
  }
}