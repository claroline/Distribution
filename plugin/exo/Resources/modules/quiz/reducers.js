
import {update} from './../utils/utils'
import {VIEW_PLAYER, VIEW_EDITOR} from './enums'
import {UPDATE_VIEW_MODE} from './actions'

function initialViewMode() {
  return VIEW_EDITOR
}

function reduceViewMode(viewMode = initialViewMode(), action = {}) {
  console.log('reduceViewMode called')
  switch (action.type) {
    case UPDATE_VIEW_MODE: {
      return action.mode
    }
  }
  return viewMode
}

export const reducers = {
  viewMode: reduceViewMode
}
