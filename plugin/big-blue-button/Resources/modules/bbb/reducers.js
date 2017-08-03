import {makeReducer} from '#/main/core/utilities/redux'
import {BBB_URL_UPDATE} from './actions'

const bbbReducers = makeReducer(null, {
  [BBB_URL_UPDATE]: (state, action) => action.url
})

const resourceReducers = makeReducer({}, {})

const mainReducers = makeReducer({}, {})

export {
  bbbReducers,
  resourceReducers,
  mainReducers
}