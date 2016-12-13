
import {update} from './../../utils/utils'
import {VIEW_PLAYER} from './../enums'
import {SWITCH_VIEW_MODE} from './actions'

function initialViewMode() {
  return {
    viewMode: VIEW_PLAYER
  }
}

function reduceViewMode(viewMode = initialViewMode(), action = {}) {
  switch (action.type) {
    case SWITCH_VIEW_MODE: {
      return update(viewMode, {$set: action.viewMode})
    }
  }
  return viewMode
}

export const reducers = {
  viewMode: reduceViewMode
}
