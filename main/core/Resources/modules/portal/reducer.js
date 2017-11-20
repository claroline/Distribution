import {makeReducer} from '#/main/core/utilities/redux'
import {makeListReducer} from '#/main/core/layout/list/reducer'

const portalReducer = makeReducer([], {})

const reducer = makeListReducer({
  data: portalReducer,
  selectable: false
})

export {
  reducer
}
