import {actions as formActions} from '#/main/core/data/form/actions'

// action creators
export const actions = {}

actions.deleteTab = (currentTabIndex, editorTabs, push) => (dispatch) => {

  const newTabs = editorTabs.tabs.slice(0)
  newTabs.splice(currentTabIndex, 1)
  console.log(editorTabs)
  dispatch(formActions.updateProp('editor', editorTabs, newTabs))
  push('/edit')
}
