// import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'

import {actions as formActions} from '#/main/core/data/form/actions'

// action creators
export const actions = {}

actions.deleteTab = (currentTabIndex, editorTabs, push) => (dispatch) => {
  const newTabs = editorTabs.slice(0)
  newTabs.splice(currentTabIndex, 1)
  dispatch(formActions.updateProp('editor', 'tabs', newTabs))
  push('/edit')
}

// actions.createTab = (editorTabs, formTab) => (dispatch) => {
//   // copy editorTabs
//   const newTabs = cloneDeep(editorTabs)
//
//   // asign new poistion to tabs if necessary
//   const newPosition = formTab.position
//   newTabs.forEach(tab => {
//     if(tab.position >= newPosition) {
//       ++tab.position
//     }
//   })
//   // add newTab to array
//   newTabs.push(formTab)
//   const tabs = cloneDeep(newTabs)
//   // sort array
//   tabs.sort((a,b) => a.position - b.position)
//
//   // updateProp
//   dispatch(formActions.updateProp('editor', 'tabs', tabs))
// }

actions.createTab = (editorTabs, formTab) => (dispatch) => dispatch(formActions.updateProp('editor', 'tabs', [formTab]
  .concat(editorTabs)
  .sort((a,b) => a.position - b.position)
  .map((tab, index) => merge({}, tab, {
    position: index + 1
  })) ))
