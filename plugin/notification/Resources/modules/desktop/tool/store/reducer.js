import {makeListReducer} from '#/main/app/content/list/store'

const reducer = {
  notifications: makeListReducer('notifications', {}, {})
}

export {
  reducer
}
