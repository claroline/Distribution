import {makeReducer} from '#/main/core/utilities/redux'
import {makePageReducer} from '#/main/core/layout/page/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'

const optionsReducer = makeReducer({}, {})

const reducer = makePageReducer({}, {
  options: optionsReducer,
  contacts: makeListReducer('contacts'),
  users: makeListReducer('users')
})

export {
  reducer
}