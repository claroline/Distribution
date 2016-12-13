
import {update} from './../utils/utils'
import {VIEW_PLAYER, VIEW_EDITOR} from './enums'
import {UPDATE_VIEW_MODE} from './actions'

function initialViewMode() {
  return {
    viewMode: VIEW_PLAYER
  }
}

function reduceViewMode(viewMode = initialViewMode(), action = {}) {
  console.log('reducer called')
  switch (action.type) {
    case UPDATE_VIEW_MODE: {
      return update(viewMode, {$set: action.viewMode})
    }
  }
  return viewMode
}

export const reducers = {
  viewMode: reduceViewMode
}
