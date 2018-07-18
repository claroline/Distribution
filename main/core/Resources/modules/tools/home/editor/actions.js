import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'

import {actions as formActions} from '#/main/core/data/form/actions'

// action creators
export const actions = {}

actions.deleteTab = (currentTabIndex, editorTabs, push) => (dispatch) => {
  const newTabs = editorTabs.slice(0)
  const tabs = newTabs.splice(currentTabIndex, 1)
    .sort((a,b) => a.position - b.position)
    .map((tab, index) => merge({}, tab, {
      position: index + 1
    }))
  dispatch(formActions.updateProp('editor', 'tabs', tabs))
  push('/edit')
}

actions.updateTab = (editorTabs, formTab, currentTab) => (dispatch) => {
  // copy editorTabs
  const newTabs = cloneDeep(editorTabs)
  const currentTabIndex = editorTabs.findIndex(tab => currentTab.id === tab.id)
  const currentTabPosition = currentTab.position
  const newPosition = formTab.position

  newTabs.splice(currentTabIndex, 1)
  if(newPosition > currentTabPosition) {
    const tabs = newTabs.sort((a,b) => a.position - b.position)
      .map((tab, index) => merge({}, tab, {
        position: index + 1
      }))
    dispatch(formActions.updateProp('editor', 'tabs', [formTab]
      .concat(tabs)
      .sort((a,b) => a.position - b.position)
      .map((tab, index) => merge({}, tab, {
        position: index + 1
      }))
    ))
  }
  else {
    dispatch(formActions.updateProp('editor', 'tabs', [formTab]
      .concat(newTabs)
      .sort((a,b) => a.position - b.position)
      .map((tab, index) => merge({}, tab, {
        position: index + 1
      }))
    ))
  }
}

actions.createTab = (editorTabs, formTab) => (dispatch) => dispatch(formActions.updateProp('editor', 'tabs', [formTab]
  .concat(editorTabs)
  .sort((a,b) => a.position - b.position)
  .map((tab, index) => merge({}, tab, {
    position: index + 1
  })) ))
