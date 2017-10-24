import {makeReducer} from '#/main/core/utilities/redux'
import {makeListReducer} from '#/main/core/layout/list/reducer'

const groupReducer = makeReducer([], {})

const reducer = makeListReducer({
  data: groupReducer
})

export {
  reducer
}
