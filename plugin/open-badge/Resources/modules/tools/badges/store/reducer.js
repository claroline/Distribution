import {combineReducers, makeReducer} from '#/main/app/store/reducer'

import {makeListReducer} from '#/main/app/content/list/store'
import {makeFormReducer} from '#/main/app/content/form/store/reducer'


const reducer = {
  badges: combineReducers({
    list: makeListReducer('badges.list'),
    mine: makeListReducer('badges.mine'),
    current: makeFormReducer('badges.current', {}, {
      assertions: makeListReducer('badges.current.assertions')
    }),
    assertion: makeFormReducer('badges.assertion', {}, {
      evidences: makeListReducer('badges.assertion.evidences')
    })
  }),
  parameters: makeFormReducer('parameters')
}

export {
  reducer
}
