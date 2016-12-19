import {makeReducer} from './../../utils/reducers'
import {getDefinition} from './../../items/item-types'

import {
  ITEMS_LOAD,
  ATTEMPT_START,
  ATTEMPT_FINISH,
  ANSWERS_SUBMIT
} from './actions'

function startAttempt() {
  return dispatch => {
    dispatch(requestPosts(subreddit))
    return fetch(`http://www.reddit.com/r/${subreddit}.json`)
      .then(response => response.json())
      .then(json => dispatch(receivePosts(subreddit, json)))
  }
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
