import {createSelector} from 'reselect'
import isEmpty from 'lodash/isEmpty'

import {currentUser} from '#/main/core/user/current'

const currentTabId = (state) => state.currentTabId
const editable = (state) => state.editable
const editing = (state) => state.editing
const context = (state) => state.context
const tabs = (state) => state.tabs
const roles = (state) => state.tabs.roles

const authenticatedUser = currentUser()

const currentTab = createSelector(
  [tabs, currentTabId],
  (tabs, currentTabId) => tabs.find(tab => currentTabId === tab.id)
)

const widgets = createSelector(
  [currentTab],
  (currentTab) => currentTab.widgets
)

const sortedTabs = createSelector(
  [tabs],
  (tabs) => tabs.sort((a,b) => a.position - b.position)
)

const visibleTabs = createSelector(
  [roles, sortedTabs],
  (roles, sortedTabs) => {
    const visible = sortedTabs.filter(tab => {
      if (isEmpty(tab.roles)) {
        return sortedTabs
      } else {
        // if user.role = tab.role the tab must be in visibleTabs
        // for every role that can see the tab
        tab.roles.forEach(id => {
          const userRolesId = authenticatedUser.roles.map(role => role.id)
          // compares with the userRoleId
          userRolesId.some(roleId => roleId === id)
        })
      }
    })
    return visible
  }
)

export const selectors = {
  currentTab,
  currentTabId,
  editable,
  editing,
  context,
  tabs,
  sortedTabs,
  visibleTabs,
  widgets
}
