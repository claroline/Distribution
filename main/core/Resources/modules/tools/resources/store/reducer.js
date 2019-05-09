import {makeInstanceAction} from '#/main/app/store/actions'
import {makeReducer} from '#/main/app/store/reducer'

import {TOOL_LOAD} from '#/main/core/tool/store/actions'
import {makeResourceExplorerReducer} from '#/main/core/resource/explorer/store'

import {selectors} from '#/main/core/tools/resources/store/selectors'

const reducer = makeResourceExplorerReducer(selectors.STORE_NAME, {
  root: null,
  directories: []
}, {
  root: makeReducer(null, {
    [makeInstanceAction(TOOL_LOAD, 'resource_manager')]: (state, action) => action.toolData.root || null
  }),
  directories: makeReducer(null, {
    [makeInstanceAction(TOOL_LOAD, 'resource_manager')]: (state, action) => action.toolData.root ? [action.toolData.root] : []
  })
})

export {
  reducer
}
