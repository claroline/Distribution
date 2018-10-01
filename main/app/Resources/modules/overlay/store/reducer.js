import {makeReducer} from '#/main/app/store/reducer'

import {
  OVERLAY_SHOW,
  OVERLAY_HIDE
} from '#/main/app/overlay/store/actions'

const reducer = makeReducer([], {
  [OVERLAY_SHOW]: (state, action) => {
    const newState = state.slice(0)

    newState.push(action.overlayId)

    return newState
  },
  [OVERLAY_HIDE]: (state, action) => {
    const newState = state.slice(0)

    const overlayPos = newState.indexOf(action.overlayId)
    if (-1 !== overlayPos) {
      newState.splice(overlayPos, 1)
    }

    return newState
  }
})

export {
  reducer
}
