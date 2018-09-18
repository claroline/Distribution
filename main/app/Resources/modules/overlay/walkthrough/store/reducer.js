import {combineReducers, makeReducer} from '#/main/app/store/reducer'

import {
  WALKTHROUGH_START,
  WALKTHROUGH_SKIP,
  WALKTHROUGH_FINISH,
  WALKTHROUGH_NEXT,
  WALKTHROUGH_PREVIOUS
} from '#/main/app/overlay/walkthrough/store/actions'

const reducer = combineReducers({
  /**
   * Is the walkthrough currently playing ?
   */
  started: makeReducer(false, {
    [WALKTHROUGH_START]: () => true,
    [WALKTHROUGH_FINISH]: () => false
  }),

  /**
   * Did the current user skipped the walkthrough ?
   */
  skipped: makeReducer(false, {
    [WALKTHROUGH_START]: () => false,
    [WALKTHROUGH_SKIP]: () => true
  }),

  /**
   * Did the current user finish the walkthrough ?
   */
  finished: makeReducer(false, {
    [WALKTHROUGH_START]: () => false,
    [WALKTHROUGH_FINISH]: () => true
  }),

  current: makeReducer(null, {
    [WALKTHROUGH_START]: () => 0,
    [WALKTHROUGH_NEXT]: (state, action) => state + 1,
    [WALKTHROUGH_PREVIOUS]: (state, action) => state - 1
  }),

  /**
   * The available steps of the walkthrough.
   */
  steps: makeReducer([], {
    [WALKTHROUGH_START]: (state, action) => action.steps
  })
})

export {
  reducer
}
