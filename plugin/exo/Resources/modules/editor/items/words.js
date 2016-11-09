import {Words as component} from './words.jsx'
import {ITEM_CREATE} from './../actions'
import {notBlank, number, gteZero} from './../lib/validate'
import {makeActionCreator} from './../util'
import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import set from 'lodash/set'

const UPDATE_SOLUTION = 'UPDATE_SOLUTION'
const ADD_SOLUTION = 'ADD_SOLUTION'
const REMOVE_SOLUTION = 'REMOVE_SOLUTION'

export const actions = {
  updateSolution: makeActionCreator(UPDATE_SOLUTION, 'index', 'property', 'value'),
  addSolution: makeActionCreator(ADD_SOLUTION),
  removeSolution: makeActionCreator(REMOVE_SOLUTION, 'index')
}


function reduce(item = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {
      return Object.assign({}, item, {
        solutions: {
          text:'',
          caseSensitive: false,
          score: 1,
          feedback: ''
        }
      })
    }

    case UPDATE_SOLUTION: {
      const newItem = cloneDeep(item)

      // mark as touched
      const solution = newItem.solutions[action.index]

      //const choiceIndex = newItem.choices.findIndex(choice => choice.id === action.id)
      const value = action.property === 'score' ? parseFloat(action.value) : action.value
      const decoratedName = action.property === 'data' ? 'data' : `_${action.property}`

      if (decoratedName === '_checked' && !item.multiple) {
        newItem.choices.forEach(choice => choice._checked = false)
      }

      newItem.choices[choiceIndex][decoratedName] = value

      if (newItem.score.type === SCORE_FIXED) {
        setScores(newItem, choice => choice._checked ? 1 : 0)
      }

      if (action.property === 'score' || action.property === 'feedback') {
        const solutionIndex = newItem.solutions.findIndex(
          solution => solution.id === action.id
        )
        newItem.solutions[solutionIndex][action.property] = value
      }

      return setChoiceTicks(newItem)
    }
    case ADD_SOLUTION: {
      const newItem = cloneDeep(item)
      const choiceId = makeId()
      newItem.choices.push({
        id: choiceId,
        data: '',
        _feedback: '',
        _score: 0,
        _checked: false,
        _deletable: true
      })
      newItem.solutions.push({
        id: choiceId,
        feedback: '',
        score: 0
      })
      const deletable = newItem.choices.length > 2
      newItem.choices.forEach(choice => choice._deletable = deletable)
      return newItem
    }
    case REMOVE_SOLUTION: {
      const newItem = cloneDeep(item)
      const choiceIndex = newItem.choices.findIndex(choice => choice.id === action.id)
      const solutionIndex = newItem.solutions.findIndex(solution => solution.id === action.id)
      newItem.choices.splice(choiceIndex, 1)
      newItem.solutions.splice(solutionIndex, 1)
      newItem.choices.forEach(choice => choice._deletable = newItem.choices.length > 2)
      return newItem
    }
  }
  return item
}


function validate(values) {
  let errors = {}

  return errors
}

export default {
  type: 'application/x.words+json',
  name: 'open',
  component,
  reduce,
  validate
}
