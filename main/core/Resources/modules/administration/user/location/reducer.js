import {makeReducer} from '#/main/core/utilities/redux'
import {makeListReducer} from '#/main/core/layout/list/reducer'

const locationReducer = makeReducer([], {})

const reducer = makeListReducer({
  data: locationReducer
})

export {
  reducer
}
