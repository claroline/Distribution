import {makeFormReducer} from '#/main/app/content/form/store/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'

const reducer = {
  options: makeFormReducer('options'),
  contacts: makeListReducer('contacts'),
  visibleUsers: makeListReducer('visibleUsers')
}

export {
  reducer
}