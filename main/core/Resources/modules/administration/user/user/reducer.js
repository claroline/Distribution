import {makeReducer} from '#/main/core/utilities/redux'
import {makeListReducer} from '#/main/core/layout/list/reducer'

const userReducer = makeReducer([], {})

const reducer = makeListReducer({
  data: userReducer
})

export {
  reducer
}
