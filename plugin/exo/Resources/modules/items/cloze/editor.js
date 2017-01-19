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
const SAVE_HOLE = 'SAVE_HOLE'
const REMOVE_HOLE = 'REMOVE_HOLE'
const REMOVE_ANSWER = 'REMOVE_ANSWER'

export const actions = {
  updateText: makeActionCreator(UPDATE_TEXT, 'text'),
  addHole: makeActionCreator(ADD_HOLE, 'word', 'startOffset', 'endOffset', 'offsetX', 'offsetY'),
  openHole: makeActionCreator(OPEN_HOLE, 'holeId', 'offsetX', 'offsetY'),
  updateHole: makeActionCreator(UPDATE_HOLE, 'holeId', 'parameter', 'value'),
  addAnswer: makeActionCreator(ADD_ANSWER, 'holeId'),
  updateAnswer: makeActionCreator(UPDATE_ANSWER, 'holeId', 'parameter', 'oldText', 'case', 'value'),
  saveHole: makeActionCreator(SAVE_HOLE),
  removeHole: makeActionCreator(REMOVE_HOLE, 'holeId'),
  removeAnswer: makeActionCreator(REMOVE_ANSWER, 'text', 'caseSensitive')
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
      newItem._text = action.text
      newItem.text = utils.getTextWithPlacerHoldersFromHtml(newItem._text)

      return newItem
    }
    case OPEN_HOLE: {
      const newItem = cloneDeep(item)
      const hole = getHoleFromId(newItem, action.holeId)

      newItem._popover = {
        offsetX: action.offsetX,
        offsetY: action.offsetY,
        startOffset: action.startOffset,
        endOffset: action.endOffset,
        holeId: action.holeId,
        hole: hole,
        solution: getSolutionFromHole(newItem, hole)
      }

      return newItem
    }
    case UPDATE_ANSWER: {
      const newItem = cloneDeep(item)
      const answer = newItem._popover.solution.answers.find(answer => answer.text === action.oldText && answer.caseSensitive === action.case)

      if (['text', 'caseSensitive', 'feedback', 'score'].indexOf(action.parameter) > -1 && answer) {
        answer[action.parameter] = action.value
      } else {
        throw `${action.parameter} is not a valid answer attribute`
      }

      return newItem
    }
    case ADD_ANSWER: {
      const newItem = cloneDeep(item)

      newItem._popover.solution.answers.push({
        text: '',
        caseSensitive: false,
        feedback: '',
        score: 1
      })

      return newItem
    }
    case UPDATE_HOLE: {
      const newItem = cloneDeep(item)

      if (['size', 'multiple'].indexOf(action.parameter) > -1) {
        newItem._popover.hole[action.parameter] = action.value
      } else {
        throw `${action.parameter} is not a valid hole attribute`
      }

      return newItem
    }
    case SAVE_HOLE: {
      const newItem = cloneDeep(item)

      //update holeId
      const currentHole = newItem.holes.find(hole => hole.id === item._popover.hole.id)

      if (currentHole) {
        //update currentHole
        // /currentHole
      } else {
        newItem.holes.push(item._popover.hole)
        newItem.solutions.push(item._popover.solution)
        newItem._text = utils.replaceBetween(
          newItem._text,
          newItem._popover.startOffset,
          newItem._popover.endOffset,
          utils.makeTinyHtml(item._popover.solution)
        )

        newItem.text = utils.getTextWithPlacerHoldersFromHtml(newItem._text)
      }

      delete newItem._popover

      return newItem
    }
    case ADD_HOLE: {
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

      newItem._popover = {
        offsetX: action.offsetX,
        offsetY: action.offsetY,
        startOffset: action.startOffset,
        endOffset: action.endOffset,
        holeId: action.holeId,
        hole,
        solution
      }

      return newItem
    }
    case REMOVE_HOLE: {
      //step1: remove from text
      alert('remove')
      //step2: remove hole from list
      const newItem = cloneDeep(item)
      const holes = newItem.holes
      holes.splice(holes.findIndex(hole => hole.id === action.holeId), 1)

      const regex = new RegExp(`(\\[\\[${action.holeId}\\]\\])`, 'gi')
      newItem.text = newItem.text.replace(regex, '')

      newItem._text = utils.setEditorHtml(newItem.text, newItem.solutions)

      return newItem
    }
    case REMOVE_ANSWER: {
      const newItem = cloneDeep(item)
      const answers = newItem._popover.solution.answers
      answers.splice(answers.findIndex(answer => answer.text === action.text && answer.caseSensitive === action.caseSensitive), 1)

      return newItem
    }
  }
}

function getHoleFromId(item, holeId) {
  return item.holes.find(hole => hole.id === holeId)
}

function getSolutionFromHole(item, hole)
{
  return item.solutions.find(solution => solution.holeId === hole.id)
}

function validate() {
  return []
}
