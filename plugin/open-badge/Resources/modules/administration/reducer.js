import {combineReducers, makeReducer} from '#/main/app/store/reducer'

import {makeListReducer} from '#/main/app/content/list/store'
import {makeFormReducer} from '#/main/app/content/form/store/reducer'


const reducer = {
  badges: combineReducers({
    list: makeListReducer('badges.list'),
    current: makeFormReducer('badges.current', {}, {
    })
  }),
  parameters: makeFormReducer('parameters')
}

export {
  reducer
}
