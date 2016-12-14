import {VIEW_EDITOR} from './enums'
import {VIEW_MODE_UPDATE} from './actions'

function initialViewMode() {
  return VIEW_EDITOR
}

function reduceViewMode(viewMode = initialViewMode(), action = {}) {
  switch (action.type) {
    case VIEW_MODE_UPDATE: {
      return action.mode
    }
  }
  return viewMode
}

export const reducers = {
  viewMode: reduceViewMode
}
