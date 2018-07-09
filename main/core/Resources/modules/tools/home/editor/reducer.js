import cloneDeep from 'lodash/cloneDeep'

import {makeFormReducer} from '#/main/core/data/form/reducer'
import {makeReducer} from '#/main/core/scaffolding/reducer'

import {
  UPDATE_DELETED_TAB,
  UPDATE_DELETED_WIDGET
} from '#/main/core/tools/home/editor/actions'

const reducer = makeFormReducer('editor', {
  data: makeReducer([] ,{
    [UPDATE_DELETED_TAB]: (state, action) => {
      const newState = cloneDeep(state)
      const index = newState.findIndex(c => c.id === action.tabId)

      if (index > -1) {
        newState.splice(index, 1)
      }

      return newState
    },
    [UPDATE_DELETED_WIDGET]: (state, action) => {
      const newState = cloneDeep(state)
      const tabIndex = newState.findIndex(tab => tab.id === action.tabId)

      if (tabIndex > -1) {
        const index = newState[tabIndex].widgets.findIndex(widget => widget.id === action.widgetId)
        if (index > -1) {
          newState[tabIndex].widgets.splice(index, 1)
        }
      }
      return newState
    }
  })
})

export {
  reducer
}
