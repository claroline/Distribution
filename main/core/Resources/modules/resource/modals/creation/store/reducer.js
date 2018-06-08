import {combineReducers, makeReducer} from '#/main/app/store/reducer'

import {makeFormReducer} from '#/main/core/data/form/reducer'

import {RESOURCE_SET_PARENT} from '#/main/core/resource/modals/creation/store/actions'
import {selectors} from '#/main/core/resource/modals/creation/store/selectors'

const reducer = combineReducers({
  parent: makeReducer(null, {
    [RESOURCE_SET_PARENT]: (state, action) => action.parent
  }),
  form: makeFormReducer(selectors.FORM_NAME, {
    node: null,
    resource: null
  })
})

export {
  reducer
}
