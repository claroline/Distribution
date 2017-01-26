import {Cloze as component} from './editor.jsx'
import {makeActionCreator, makeId} from './../../utils/utils'
import cloneDeep from 'lodash/cloneDeep'
import {ITEM_CREATE} from './../../quiz/editor/actions'
import {utils} from './utils/utils'
import flatten from 'lodash/flatten'
import {notBlank} from './../../utils/validate'
import set from 'lodash/set'
import {tex} from './../../utils/translate'

const UPDATE_TEXT = 'UPDATE_TEXT'
const ADD_HOLE = 'ADD_HOLE'
const OPEN_HOLE = 'OPEN_HOLE'
const UPDATE_HOLE = 'UPDATE_HOLE'
const ADD_ANSWER = 'ADD_ANSWER'
const UPDATE_ANSWER = 'UPDATE_ANSWER'
const SAVE_HOLE = 'SAVE_HOLE'
const REMOVE_HOLE = 'REMOVE_HOLE'
const REMOVE_ANSWER = 'REMOVE_ANSWER'
const CLOSE_POPOVER = 'CLOSE_POPOVER'

export const actions = {
  updateText: makeActionCreator(UPDATE_TEXT, 'text'),
  addHole: makeActionCreator(ADD_HOLE, 'word', 'startOffset', 'endOffset', 'offsetX', 'offsetY'),
  openHole: makeActionCreator(OPEN_HOLE, 'holeId', 'offsetX', 'offsetY'),
  updateHole: makeActionCreator(UPDATE_HOLE, 'holeId', 'parameter', 'value'),
  addAnswer: makeActionCreator(ADD_ANSWER, 'holeId'),
  updateAnswer: makeActionCreator(UPDATE_ANSWER, 'holeId', 'parameter', 'oldText', 'case', 'value'),
  saveHole: makeActionCreator(SAVE_HOLE),
  removeHole: makeActionCreator(REMOVE_HOLE, 'holeId'),
  removeAnswer: makeActionCreator(REMOVE_ANSWER, 'text', 'caseSensitive'),
  closePopover: makeActionCreator(CLOSE_POPOVER)
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
      return Object.assign({}, item, {
        text: utils.getTextWithPlacerHoldersFromHtml(action.text),
        _text: action.text
      })
    }
    case OPEN_HOLE: {
      const newItem = cloneDeep(item)
      const hole = getHoleFromId(newItem, action.holeId)
      hole._multiple = hole.choices ? true: false

      newItem._popover = {
        offsetX: action.offsetX,
        offsetY: action.offsetY,
        startOffset: action.startOffset,
        endOffset: action.endOffset,
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
        score: 1,
        _multiple: false
      })

      return newItem
    }
    case UPDATE_HOLE: {
      const newItem = cloneDeep(item)

      if (['size', '_multiple'].indexOf(action.parameter) > -1) {
        newItem._popover.hole[action.parameter] = action.value
      } else {
        throw `${action.parameter} is not a valid hole attribute`
      }

      return newItem
    }
    case SAVE_HOLE: {
      const newItem = cloneDeep(item)

      //update holeId
      const holeIdx = newItem.holes.findIndex(hole => hole.id === item._popover.hole.id)
      const holeSolutions = newItem.solutions.filter(solution => solution.holeId === item._popover.hole.id)
      const choices = newItem._popover.hole._multiple ?
        flatten(holeSolutions.map(solution => solution.answers.map(answer => answer.text))): []

      if (holeIdx > -1) {
        newItem.holes[holeIdx] = newItem._popover.hole
        const solutionIdx = newItem.solutions.findIndex(solution => solution.holeId === item._popover.solution.holeId)
        newItem.solutions[solutionIdx] = newItem._popover.solution
        newItem.holes[holeIdx].choices = choices
      } else {
        newItem.holes.push(newItem._popover.hole)
        newItem.holes[newItem.holes.length - 1].choices = choices
        newItem.solutions.push(newItem._popover.solution)
        newItem._text = utils.replaceBetween(
          newItem._text,
          newItem._popover.startOffset,
          newItem._popover.endOffset,
          utils.makeTinyHtml(newItem._popover.solution)
        )
        //choices can't be empty tho so...

        newItem.text = utils.getTextWithPlacerHoldersFromHtml(newItem._text)
      }

      const currentHole = holeIdx === -1 ? newItem.holes[newItem.holes.length - 1]: newItem.holes[holeIdx]
      if (currentHole.choices.length === 0) {
        delete currentHole.choices
      }

      delete newItem._popover

      return newItem
    }
    case ADD_HOLE: {
      const newItem = cloneDeep(item)

      const hole = {
        'id': makeId(),
        feedback: '',
        size: 10,
        _score: 0,
        placeholder: '',
        choices: []
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
        hole,
        solution
      }

      return newItem
    }
    case REMOVE_HOLE: {
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
    case CLOSE_POPOVER: {
      const newItem = cloneDeep(item)
      delete newItem._popover

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

function validate(item) {
  const _errors = {}

  if (item._popover) {
    item._popover.solution.answers.forEach((answer, key) => {
      if (notBlank(answer.text, true)) {
        set(_errors, `answers.${key}.text`, tex('cloze_empty_word_error'))
      }

      if (notBlank(answer.score, true) && answer.score !== 0) {
        set(_errors, `answers.${key}.score`, tex('cloze_empty_score_error'))
      }
    })

    if (item._popover.hole._multiple && item._popover.solution.answers.length < 2) {
      set(_errors, 'answers.multiple', tex('cloze_multiple_answers_required'))
    }

    if (notBlank(item._popover.hole.size, true)) {
      set(_errors, 'answers.size', tex('cloze_empty_size_error'))
    }
  }

  if (notBlank(item.text, true)) {
    _errors.text = tex('cloze_empty_text_error')
  }

  if (!_errors.text) {
    if (item.holes.length === 0) {
      _errors.text = tex('cloze_must_contains_clozes_error')
    }
  }

  return _errors
}
