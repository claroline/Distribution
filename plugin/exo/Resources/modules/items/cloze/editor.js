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
  addHole: makeActionCreator(ADD_HOLE)
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

      //http://stackoverflow.com/questions/3997659/replace-selected-text-in-contenteditable-div
      let selection = window.getSelection()

      //here we should double check we're really selecting stuff inside the editor

      //do something smart here

      if (selection.rangeCount) {
        let range = selection.getRangeAt(0)
        let selected = selection.toString()
        range.deleteContents()
        range.insertNode(document.createTextNode(`[[${hole.id}]]`))
        newItem.text = range.startContainer.parentNode.innerText

        const solution = {
          holeId: hole.id,
          answers: [{
            text: selected,
            caseSensitive: false,
            _feedback: '',
            score: 1
          }]
        }

        newItem.holes.push(hole)
        newItem.solutions.push(solution)
        newItem._text = utils.setEditorHtml(newItem.text, newItem.solutions)

        return newItem
      }


    }
  }

  return item
}

function validate() {
  return []
}
