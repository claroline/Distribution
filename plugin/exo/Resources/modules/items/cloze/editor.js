import {Cloze as component} from './editor.jsx'
import {makeActionCreator, makeId} from './../../utils/utils'
import cloneDeep from 'lodash/cloneDeep'
import {ITEM_CREATE} from './../../quiz/editor/actions'
import {utils} from './utils/utils'

const UPDATE_TEXT = 'UPDATE_TEXT'
const ADD_HOLE = 'ADD_HOLE'
const OPEN_HOLE = 'OPEN_HOLE'
const UPDATE_HOLE = 'UPDATE_HOLE'
const ADD_ANSWER = 'ADD_ANSWER'
const UPDATE_ANSWER = 'UPDATE_ANSWER'
//const REMOVE_HOLE = 'REMOVE_HOLE'

export const actions = {
  updateText: makeActionCreator(UPDATE_TEXT, 'text'),
  addHole: makeActionCreator(ADD_HOLE, 'word', 'startOffset', 'endOffset', 'offsetX', 'offsetY'),
  openHole: makeActionCreator(OPEN_HOLE, 'holeId'),
  updateHole: makeActionCreator(UPDATE_HOLE, 'holeId', 'parameter', 'value'),
  addAnswer: makeActionCreator(ADD_ANSWER, 'holeId'),
  updateAnswer: makeActionCreator(UPDATE_ANSWER, 'holeId', 'parameter', 'oldText', 'case', 'value')
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
    case OPEN_HOLE: {
      const newItem = cloneDeep(item)

      newItem._popover = {
        offsetX: action.offsetX,
        offsetY: action.offsetY,
        holeId: action.holeId
      }

      return newItem
    }
    case UPDATE_ANSWER: {
      const newItem = cloneDeep(item)
      const hole = getHoleFromId(newItem, action.holeId)
      const answer = getAnswerFromHole(hole, action.oldText, action.case)

      if (['text', 'caseSensitive', 'feedback', 'score'].indexOf(action.parameter)) {
        answer[action.parameter] = action.value
      } else {
        throw `${action.parameter} is not a valid answer attribute`
      }

      return newItem
    }
    case ADD_ANSWER: {
      const newItem = cloneDeep(item)
      const hole = getHoleFromId(newItem, action.holeId)
      const solution = getHoleSolution(newItem, hole)
      solution.answers.push({
        text: '',
        caseSensitive: false,
        feedback: '',
        score: 1
      })

      return newItem
    }
    case UPDATE_HOLE: {
      const newItem = cloneDeep(item)
      const hole = getHoleFromId(item, action.holeId)

      if (['size', 'multiple'].indexOf(action.parameter)) {
        hole[action.parameter] = action.value
      } else {
        throw `${action.parameter} is not a valid hole attribute`
      }

      return newItem
    }
    case ADD_HOLE: {
      let text = item.text
      const _text = item._text
      const newItem = cloneDeep(item)

      const hole = {
        'id': makeId(),
        feedback: '',
        size: 25,
        _score: 0
      }

      const solution = {
        holeId: hole.id,
        answers: [{
          text: action.word,
          caseSensitive: false,
          feedback: '',
          score: 1
        }]
      }

      newItem._text = utils.replaceBetween(
        _text,
        action.startOffset,
        action.endOffset,
        utils.makeTinyHtml(solution)
      )

      newItem.text = text
      newItem.solutions.push(solution)
      newItem.holes.push(hole)

      newItem._popover = {
        offsetX: action.offsetX,
        offsetY: action.offsetY,
        holeId: action.holeId
      }

      newItem._openedHole = hole

      return newItem
    }
  }

  return item
}

function getHoleSolution(item, hole) {
  return item.solutions.find(solution => solution.holeId === hole.id)
}

function getHoleFromId(item, holeId) {
  return item.holes.find(hole => hole.id === holeId)
}

function getAnswerFromHole(hole, oldText, caseSensitive) {
  return hole.answers.find(answer => answer.text === oldText && answer.caseSensitive === caseSensitive)
}

function validate() {
  return []
}
