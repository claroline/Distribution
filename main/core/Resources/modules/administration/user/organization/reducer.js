import {makeReducer} from '#/main/core/utilities/redux'
import {makeListReducer} from '#/main/core/layout/list/reducer'

const organizationReducer = makeReducer([], {})

const reducer = makeListReducer({
  data: organizationReducer
})

export {
  reducer
}
