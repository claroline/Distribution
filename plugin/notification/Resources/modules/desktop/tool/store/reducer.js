import {makeListReducer} from '#/main/app/content/list/store'
import {constants as listConstants} from '#/main/app/content/list/constants'

const reducer = {
  notifications: makeListReducer('notifications', {availableDisplays: [listConstants.DISPLAY_LIST]}, {})
}

export {
  reducer
}
