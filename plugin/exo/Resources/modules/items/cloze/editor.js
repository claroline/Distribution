import {Cloze as component} from './editor.jsx'
import {makeActionCreator, makeId} from './../../utils/utils'
import cloneDeep from 'lodash/cloneDeep'
import {ITEM_CREATE} from './../../quiz/editor/actions'
import {utils} from './utils/utils'

const UPDATE_TEXT = 'UPDATE_TEXT'
const ADD_HOLE = 'ADD_HOLE'
//const REMOVE_HOLE = 'REMOVE_HOLE'
//const UPDATE_HOLE = 'UPDATE_HOLE'

export const actions = {
  updateText: makeActionCreator(UPDATE_TEXT, 'text'),
  addHole: makeActionCreator(ADD_HOLE, 'word', 'cb')
}

export default {
  component,
  reduce,
  validate,
  decorate
}

function decorate(item) {
  return Object.assign({}, item, {
    _text: utils.setEditorHtml(item.text, item.solutions)
  })
}

function reduce(item = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {
      return Object.assign({}, item, {
        text: '',
        holes: [],
        solutions: [],
        _text: ''
      })
    }
    case UPDATE_TEXT: {
      const newItem = cloneDeep(item)
      newItem.text = action.text
      newItem._text = action.text
      return newItem
    }
    case ADD_HOLE: {
      const newItem = cloneDeep(item)

      const hole = {
        'id': makeId(),
        feedback: '',
        _score: 0
      }

      const solution = {
        holeId: hole.id,
        answers: [{
          text: action.word,
          caseSensitive: false,
          _feedback: '',
          score: 1
        }]
      }

      newItem.text = action.cb(`[[${hole.id}]]`)
      newItem._text = utils.setEditorHtml(newItem.text, newItem.solutions)
      newItem.holes.push(hole)
      newItem.solutions.push(solution)

      return newItem
    }
  }

  return item
}

function validate() {
  return []
}
