import {makeListReducer} from '#/main/app/content/list/store'
import {combineReducers, makeReducer} from '#/main/app/store/reducer'

const reducer = combineReducers({
  notifications: makeListReducer('notification.notifications', {}, {})
})

export {
  reducer
}
