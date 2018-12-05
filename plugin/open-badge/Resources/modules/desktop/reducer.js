import {combineReducers} from '#/main/app/store/reducer'

import {makeListReducer} from '#/main/app/content/list/store'


const reducer = {
  badges: combineReducers({
    list: makeListReducer('badges.list'),
    mine: makeListReducer('badges.mine')
  })
}

export {
  reducer
}
