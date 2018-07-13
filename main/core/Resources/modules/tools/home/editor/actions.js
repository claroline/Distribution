import {actions as formActions} from '#/main/core/data/form/actions'

// action creators
export const actions = {}

actions.deleteTab = (currentTabIndex, editorTabs, push) => (dispatch) => {
  const newTabs = editorTabs.slice(0)
  newTabs.splice(currentTabIndex, 1)
  dispatch(formActions.updateProp('editor', 'tabs', newTabs))
  push('/edit')
}
