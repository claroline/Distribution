import {makeReducer, combineReducers} from '#/main/app/store/reducer'

import {makeFormReducer} from '#/main/core/data/form/reducer'

import {Widget as WidgetTypes} from '#/main/core/widget/prop-types'
import {selectors} from '#/main/core/widget/editor/modals/creation/store/selectors'
import {WIDGET_TYPES_LOAD} from '#/main/core/widget/editor/modals/creation/store/actions'

const reducer = combineReducers({
  availableTypes: makeReducer([], {
    [WIDGET_TYPES_LOAD]: (state, action) => action.types
  }),
  instance: makeFormReducer(selectors.FORM_NAME, {
    data: WidgetTypes.defaultProps
  })
})

export {
  reducer
}
