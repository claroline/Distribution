/*
 * This file is part of the Claroline Connect package.
 *
 * (c) Claroline Consortium <consortium@claroline.net>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

export default class HomeTabService {
  constructor($http, $uibModal, ClarolineAPIService, WidgetService) {
    this.$http = $http
    this.$uibModal = $uibModal
    this.ClarolineAPIService = ClarolineAPIService
    this.WidgetService = WidgetService
    this.adminHomeTabs = []
    this.userHomeTabs = []
    this.workspaceHomeTabs = []
    this.options = {
      canEdit: false,
      selectedTabId: 0,
      selectedTabConfigId: 0,
      selectedTabIsLocked: true,
      workspaceId: null
    }
    this._addUserHomeTabCallback = this._addUserHomeTabCallback.bind(this)
    this._addWorkspaceHomeTabCallback = this._addWorkspaceHomeTabCallback.bind(this)
    this._addAdminHomeTabCallback = this._addAdminHomeTabCallback.bind(this)
    this._updateUserHomeTabCallback = this._updateUserHomeTabCallback.bind(this)
    this._updateWorkspaceHomeTabCallback = this._updateWorkspaceHomeTabCallback.bind(this)
    this._updateAdminHomeTabCallback = this._updateAdminHomeTabCallback.bind(this)
    this._removeAdminHomeTabCallback = this._removeAdminHomeTabCallback.bind(this)
    this._removeWorkspaceHomeTabCallback = this._removeWorkspaceHomeTabCallback.bind(this)
    this._removeUserHomeTabCallback = this._removeUserHomeTabCallback.bind(this)
  }

  _addUserHomeTabCallback(data) {
    this.userHomeTabs.push(data)
  }

  _addWorkspaceHomeTabCallback(data) {
    this.workspaceHomeTabs.push(data)
  }

  _addAdminHomeTabCallback(data) {
    this.adminHomeTabs.push(data)
  }

  _updateUserHomeTabCallback(data) {
    if (data['tabId']) {
      const index = this.userHomeTabs.findIndex(tab => data['tabId'] === tab['tabId'])

      if (index > -1) {
        this.userHomeTabs[index]['tabName'] = data['tabName']
        this.userHomeTabs[index]['color'] = data['color']
      }
    }
  }

  _updateWorkspaceHomeTabCallback(data) {
    if (data['tabId']) {
      const index = this.workspaceHomeTabs.findIndex(tab => data['tabId'] === tab['tabId'])

      if (index > -1) {
        this.workspaceHomeTabs[index]['tabName'] = data['tabName']
        this.workspaceHomeTabs[index]['color'] = data['color']
        this.workspaceHomeTabs[index]['locked'] = data['locked']
        this.workspaceHomeTabs[index]['visible'] = data['visible']
      }
    }
  }

  _updateAdminHomeTabCallback(data) {
    if (data['tabId']) {
      const index = this.adminHomeTabs.findIndex(tab => data['tabId'] === tab['tabId'])

      if (index > -1) {
        this.adminHomeTabs[index]['tabName'] = data['tabName']
        this.adminHomeTabs[index]['color'] = data['color']
        this.adminHomeTabs[index]['locked'] = data['locked']
        this.adminHomeTabs[index]['visible'] = data['visible']

      }
    }
  }

  _removeAdminHomeTabCallback(data) {
    if (data['tabId']) {
      const index = this.adminHomeTabs.findIndex(tab => data['tabId'] === tab['tabId'])

      if (index > -1) {
        this.adminHomeTabs.splice(index, 1)
      }

      if (data['tabId'] === this.options['selectedTabId']) {
        this.selectDefaultHomeTab()
      }
    }
  }

  _removeUserHomeTabCallback(data) {
    if (data['tabId']) {
      const index = this.userHomeTabs.findIndex(tab => data['tabId'] === tab['tabId'])

      if (index > -1) {
        this.userHomeTabs.splice(index, 1)
      }

      if (data['tabId'] === this.options['selectedTabId']) {
        this.selectDefaultHomeTab()
      }
    }
  }

  _removeWorkspaceHomeTabCallback(data) {
    if (data['tabId']) {
      const index = this.workspaceHomeTabs.findIndex(tab => data['tabId'] === tab['tabId'])

      if (index > -1) {
        this.workspaceHomeTabs.splice(index, 1)
      }

      if (data['tabId'] === this.options['selectedTabId']) {
        this.selectDefaultHomeTab()
      }
    }
  }

  getAdminHomeTabs() {
    return this.adminHomeTabs
  }

  getUserHomeTabs() {
    return this.userHomeTabs
  }

  getWorkspaceHomeTabs() {
    return this.workspaceHomeTabs
  }

  getOptions() {
    return this.options
  }

  loadDesktopHomeTabs() {
    const route = Routing.generate('api_get_desktop_home_tabs')

    return this.$http.get(route).then(datas => {
      if (datas['status'] === 200) {
        this.adminHomeTabs.splice(0, this.adminHomeTabs.length)
        this.userHomeTabs.splice(0, this.userHomeTabs.length)
        this.workspaceHomeTabs.splice(0, this.workspaceHomeTabs.length)
        angular.merge(this.adminHomeTabs, datas['data']['tabsAdmin'])
        angular.merge(this.userHomeTabs, datas['data']['tabsUser'])
        angular.merge(this.workspaceHomeTabs, datas['data']['tabsWorkspace'])
        this.selectDefaultHomeTab()
      }
    })
  }

  loadAdminHomeTabs() {
    const route = Routing.generate('api_get_admin_home_tabs')

    return this.$http.get(route).then(datas => {
      if (datas['status'] === 200) {
        this.adminHomeTabs.splice(0, this.adminHomeTabs.length)
        angular.merge(this.adminHomeTabs, datas['data'])
        this.selectDefaultAdminHomeTab()
      }
    })
  }

  loadWorkspaceHomeTabs() {
    const route = Routing.generate('api_get_workspace_home_tabs', {workspace: this.options['workspaceId']})

    return this.$http.get(route).then(datas => {
      if (datas['status'] === 200) {
        this.workspaceHomeTabs.splice(0, this.workspaceHomeTabs.length)
        angular.merge(this.workspaceHomeTabs, datas['data'])
        this.selectDefaultWorkspaceHomeTab()
      }
    })
  }

  selectDefaultAdminHomeTab() {
    this.options['selectedTabId'] = 0
    this.options['selectedTabConfigId'] = 0

    if (this.adminHomeTabs.length > 0) {
      this.options['selectedTabId'] = this.adminHomeTabs[0]['tabId']
      this.options['selectedTabConfigId'] = this.adminHomeTabs[0]['configId']
    }
    this.WidgetService.loadAdminWidgets(this.options['selectedTabId'])
  }

  selectDefaultWorkspaceHomeTab() {
    this.options['selectedTabId'] = 0
    this.options['selectedTabConfigId'] = 0

    if (this.workspaceHomeTabs.length > 0) {
      this.options['selectedTabId'] = this.workspaceHomeTabs[0]['tabId']
      this.options['selectedTabConfigId'] = this.workspaceHomeTabs[0]['configId']
    }
    this.WidgetService.loadWorkspaceWidgets(this.options['selectedTabId'])
  }

  selectDefaultHomeTab() {
    this.options['selectedTabId'] = 0
    this.options['selectedTabConfigId'] = 0
    this.options['selectedTabIsLocked'] = true

    if (this.adminHomeTabs.length > 0) {
      this.options['selectedTabId'] = this.adminHomeTabs[0]['tabId']
      this.options['selectedTabConfigId'] = this.adminHomeTabs[0]['configId']
      this.options['selectedTabIsLocked'] = this.adminHomeTabs[0]['locked']
    } else if (this.userHomeTabs.length > 0) {
      this.options['selectedTabId'] = this.userHomeTabs[0]['tabId']
      this.options['selectedTabConfigId'] = this.userHomeTabs[0]['configId']
      this.options['selectedTabIsLocked'] = false
    } else if (this.workspaceHomeTabs.length > 0) {
      this.options['selectedTabId'] = this.workspaceHomeTabs[0]['tabId']
      this.options['selectedTabConfigId'] = this.workspaceHomeTabs[0]['configId']
      this.options['selectedTabIsLocked'] = true
    }
    this.WidgetService.loadDesktopWidgets(this.options['selectedTabId'], this.options['canEdit'])
  }

  createUserHomeTab() {
    if (this.options['canEdit']) {
      const modal = this.$uibModal.open({
        templateUrl: Routing.generate('api_get_user_home_tab_creation_form'),
        controller: 'UserHomeTabCreationModalCtrl',
        controllerAs: 'htfmc',
        resolve: {
          callback: () => { return this._addUserHomeTabCallback }
        }
      })

      modal.result.then(result => {
        if (!result) {
          return
        } else {
          this._addUserHomeTabCallback(result)
        }
      })
    }
  }

  editUserHomeTab(tabId) {
    if (this.options['canEdit']) {
      const modal = this.$uibModal.open({
        templateUrl: Routing.generate(
          'api_get_user_home_tab_edition_form',
          {homeTab: tabId}
        ) + '?bust=' + Math.random().toString(36).slice(2),
        controller: 'UserHomeTabEditionModalCtrl',
        controllerAs: 'htfmc',
        resolve: {
          homeTabId: () => { return tabId },
          callback: () => { return this._updateUserHomeTabCallback }
        }
      })

      modal.result.then(result => {
        if (!result) {
          return
        } else {
          this._updateUserHomeTabCallback(result)
        }
      })
    }
  }

  hideAmdinHomeTab(tabConfigId) {
    if (this.options['canEdit']) {
      const url = Routing.generate('api_put_admin_home_tab_visibility_toggle', {htc: tabConfigId})

      this.ClarolineAPIService.confirm(
        {url, method: 'PUT'},
        this._removeAdminHomeTabCallback,
        Translator.trans('home_tab_delete_confirm_title', {}, 'platform'),
        Translator.trans('home_tab_delete_confirm_message', {}, 'platform')
      )
    }
  }

  deleteUserHomeTab(tabConfigId) {
    if (this.options['canEdit']) {
      const url = Routing.generate('api_delete_user_home_tab', {htc: tabConfigId})

      this.ClarolineAPIService.confirm(
        {url, method: 'DELETE'},
        this._removeUserHomeTabCallback,
        Translator.trans('home_tab_delete_confirm_title', {}, 'platform'),
        Translator.trans('home_tab_delete_confirm_message', {}, 'platform')
      )
    }
  }

  deletePinnedWorkspaceHomeTab(tabConfigId) {
    const url = Routing.generate('api_delete_pinned_workspace_home_tab', {htc: tabConfigId})

    this.ClarolineAPIService.confirm(
      {url, method: 'DELETE'},
      this._removeWorkspaceHomeTabCallback,
      Translator.trans('home_tab_bookmark_delete_confirm_title', {}, 'platform'),
      Translator.trans('home_tab_bookmark_delete_confirm_message', {}, 'platform')
    )
  }

  createAdminHomeTab() {
    const modal = this.$uibModal.open({
      templateUrl: Routing.generate('api_get_admin_home_tab_creation_form'),
      controller: 'AdminHomeTabCreationModalCtrl',
      controllerAs: 'htfmc',
      resolve: {
        callback: () => { return this._addAdminHomeTabCallback }
      }
    })

    modal.result.then(result => {
      if (!result) {
        return
      } else {
        this._addAdminHomeTabCallback(result)
      }
    })
  }

  editAdminHomeTab(tabConfigId) {
    const modal = this.$uibModal.open({
      templateUrl: Routing.generate(
        'api_get_admin_home_tab_edition_form',
        {homeTabConfig: tabConfigId}
      ) + '?bust=' + Math.random().toString(36).slice(2),
      controller: 'AdminHomeTabEditionModalCtrl',
      controllerAs: 'htfmc',
      resolve: {
        homeTabConfigId: () => { return tabConfigId },
        callback: () => { return this._updateAdminHomeTabCallback }
      }
    })

    modal.result.then(result => {
      if (!result) {
        return
      } else {
        this._updateAdminHomeTabCallback(result)
      }
    })
  }

  deleteAdminHomeTab(tabConfigId) {
    const url = Routing.generate('api_delete_admin_home_tab', {homeTabConfig: tabConfigId})

    this.ClarolineAPIService.confirm(
      {url, method: 'DELETE'},
      this._removeAdminHomeTabCallback,
      Translator.trans('home_tab_delete_confirm_title', {}, 'platform'),
      Translator.trans('home_tab_delete_confirm_message', {}, 'platform')
    )
  }

  createWorkspaceHomeTab() {
    const modal = this.$uibModal.open({
      templateUrl: Routing.generate('api_get_workspace_home_tab_creation_form', {workspace: this.options['workspaceId']}),
      controller: 'WorkspaceHomeTabCreationModalCtrl',
      controllerAs: 'htfmc',
      resolve: {
        workspaceId: () => { return this.options['workspaceId'] },
        callback: () => { return this._addWorkspaceHomeTabCallback }
      }
    })

    modal.result.then(result => {
      if (!result) {
        return
      } else {
        this._addWorkspaceHomeTabCallback(result)
      }
    })
  }

  editWorkspaceHomeTab(tabConfigId) {
    const modal = this.$uibModal.open({
      templateUrl: Routing.generate(
        'api_get_workspace_home_tab_edition_form',
        {homeTabConfig: tabConfigId}
      ) + '?bust=' + Math.random().toString(36).slice(2),
      controller: 'WorkspaceHomeTabEditionModalCtrl',
      controllerAs: 'htfmc',
      resolve: {
        workspaceId: () => { return this.options['workspaceId'] },
        homeTabConfigId: () => { return tabConfigId },
        callback: () => { return this._updateWorkspaceHomeTabCallback }
      }
    })

    modal.result.then(result => {
      if (!result) {
        return
      } else {
        this._updateWorkspaceHomeTabCallback(result)
      }
    })
  }

  deleteWorkspaceHomeTab(tabConfigId) {
    const url = Routing.generate('api_delete_workspace_home_tab', {homeTabConfig: tabConfigId})

    this.ClarolineAPIService.confirm(
      {url, method: 'DELETE'},
      this._removeWorkspaceHomeTabCallback,
      Translator.trans('home_tab_delete_confirm_title', {}, 'platform'),
      Translator.trans('home_tab_delete_confirm_message', {}, 'platform')
    )
  }

  pinWorkspaceHomeTab(tabConfigId) {
    const url = Routing.generate('api_post_workspace_home_tab_bookmark', {homeTabConfig: tabConfigId})

    this.ClarolineAPIService.confirm(
      {url, method: 'DELETE'},
      () => {},
      Translator.trans('home_tab_bookmark_confirm_title', {}, 'platform'),
      Translator.trans('home_tab_bookmark_confirm_message', {}, 'platform')
    )
  }
}
