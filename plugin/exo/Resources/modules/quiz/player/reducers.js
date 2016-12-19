import {makeReducer} from './../../utils/reducers'
import {getDefinition} from './../../items/item-types'

import {
  ITEMS_LOAD,
  ATTEMPT_START,
  ATTEMPT_FINISH,
  ANSWERS_SUBMIT
} from './actions'

function startAttempt(state, action) {
  return action.attempt
}

function finishAttempt() {

}

function submitAnswers() {

}

function loadItems(state, action) {
  return action.items.map(item => getDefinition(item.type).player.decorate(item))
}

export const reducers = {
  items: makeReducer([], {
    [ITEMS_LOAD]: loadItems
  }),
  attempt: makeReducer({}, {
    [ATTEMPT_START]: startAttempt,
    [ATTEMPT_FINISH]: finishAttempt,
    [ANSWERS_SUBMIT]: submitAnswers
  })
}
