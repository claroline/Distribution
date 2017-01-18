import {ITEM_CREATE} from './../../quiz/editor/actions'
import {makeId, makeActionCreator} from './../../utils/utils'
import {MODE_RECT} from './enums'
import {Graphic as component} from './editor.jsx'

const SELECT_MODE = 'SELECT_MODE'

export const actions = {
  selectMode: makeActionCreator(SELECT_MODE, 'mode')
}

function reduce(item = {}, action = {}) {
  switch (action.type) {
    case ITEM_CREATE: {
      return decorate(Object.assign({}, item, {
        image: {
          id: makeId(),
          type: '',
          url: '',
          width: 0,
          height: 0
        },
        pointers: 0,
        solutions: []
      }))
    }
    case SELECT_MODE: {
      return Object.assign({}, item, {
        _editor: Object.assign({}, item._editor, {
          mode: action.mode
        })
      })
    }
  }
  return item
}

function decorate(item) {
  return Object.assign({}, item, {
    _editor: {
      mode: MODE_RECT
    }
  })
}

export default {
  component,
  reduce,
  decorate
}
