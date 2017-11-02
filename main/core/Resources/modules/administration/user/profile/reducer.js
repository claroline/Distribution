import cloneDeep from 'lodash/cloneDeep'

import {makeId} from '#/main/core/utilities/id'
import {combineReducers, makeReducer} from '#/main/core/utilities/redux'

import {
  PROFILE_ADD_TAB
} from './actions'

const currentTabReducer = makeReducer(null, {

})

const tabsReducer = makeReducer({}, {
  [PROFILE_ADD_TAB]: (state) => {
    const newState = cloneDeep(state)
    const id = makeId()

    newState[id] = {
      id: id,
      title: 'New tab'
    }

    return newState
  }
})

const sectionReducer = makeReducer({}, {

})

const reducer = combineReducers({
  currentTab: currentTabReducer,
  tabs: tabsReducer,
  sections: sectionReducer
})

export {
  reducer
}
