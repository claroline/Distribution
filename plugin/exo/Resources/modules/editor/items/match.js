import {Match as component} from './match.jsx'
import {ITEM_CREATE} from './../actions'
import {makeId, makeActionCreator} from './../util'
import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import set from 'lodash/set'
import {tex} from './../lib/translate'
import {notBlank, number, chain} from './../lib/validate'


const UPDATE_SOLUTION = 'UPDATE_SOLUTION'
const ADD_SOLUTION = 'ADD_SOLUTION'
const REMOVE_SOLUTION = 'REMOVE_SOLUTION'
const UPDATE_PROP = 'UPDATE_PROP'
const ADD_SET = 'ADD_SET'
const REMOVE_SET = 'REMOVE_SET'
const UPDATE_SET = 'UPDATE_SET'

export const actions = {
  updateSolution: makeActionCreator(UPDATE_SOLUTION, 'firstSetId', 'secondSetId', 'property', 'value'),
  addSolution: makeActionCreator(ADD_SOLUTION, 'solution'),
  removeSolution: makeActionCreator(REMOVE_SOLUTION, 'firstSetId', 'secondSetId'),
  updateProperty: makeActionCreator(UPDATE_PROP, 'property', 'value'),
  addSet: makeActionCreator(ADD_SET, 'isLeftSet'),
  updateSet: makeActionCreator(UPDATE_SET, 'isLeftSet', 'id', 'value'),
  removeSet: makeActionCreator(REMOVE_SET, 'isLeftSet', 'id')
}

function decorate(item) {

  const leftItemDeletable = getLeftItemDeletable(item)
  const firstSetWithDeletable = item.firstSet.map(
    set => Object.assign({}, set, {
      _deletable: leftItemDeletable
    })
  )

  const rightItemDeletable = getRightItemDeletable(item)
  const secondSetWithDeletable = item.secondSet.map(
    set => Object.assign({}, set, {
      _deletable: rightItemDeletable
    })
  )

  const solutionsWithDeletable = item.solutions.map(
    solution => Object.assign({}, solution, {
      _deletable: item.solutions.length > 0
    })
  )

  let decorated = Object.assign({}, item, {
    firstSet: firstSetWithDeletable,
    secondSet: secondSetWithDeletable,
    solutions: solutionsWithDeletable
  })

  return decorated
}

function reduce(item = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {
      return decorate(Object.assign({}, item, {
        random: false,
        penalty: 0,
        firstSet: [
          {
            id: makeId(),
            type: 'text/html',
            data: ''
          }
        ],
        secondSet: [
          {
            id: makeId(),
            type: 'text/html',
            data: ''
          },
          {
            id: makeId(),
            type: 'text/html',
            data: ''
          }
        ],
        solutions: []
      }))
    }

    case ADD_SOLUTION: {
      const newItem = cloneDeep(item)
      newItem.solutions.push(action.solution)
      newItem.solutions.forEach(solution => solution._deletable = newItem.solutions.length > 1)
      return newItem
    }

    case UPDATE_SOLUTION: {
      const newItem = cloneDeep(item)
      const value = action.property === 'score' ? parseFloat(action.value) : action.value
      let solution = newItem.solutions.find(solution => solution.firstSetId === action.firstSetId && solution.secondSetId === action.secondSetId)
      // mark as touched
      newItem._touched = merge(
        newItem._touched || {},
        set({}, action.property, true)
      )

      solution[action.property] = value
      return newItem
    }

    case REMOVE_SOLUTION: {
      const newItem = cloneDeep(item)
      const solutionIndex = newItem.solutions.findIndex(solution => solution.firstSetId === action.firstSetId && solution.secondSetId === action.secondSetId)
      newItem.solutions.splice(solutionIndex, 1)      
      newItem.solutions.forEach(solution => solution._deletable = newItem.solutions.length > 1)
      return newItem
    }

    case UPDATE_PROP: {
      const newItem = cloneDeep(item)
      const value = action.property === 'penalty' ? parseFloat(action.value) : Boolean(action.value)
      // mark as touched
      newItem._touched = merge(
        newItem._touched || {},
        set({}, action.property, true)
      )
      newItem[action.property] = value
      return newItem
    }

    case ADD_SET: {

      const toAdd = {
        id: makeId(),
        type: 'text/html',
        data: ''
      }

      const newItem = cloneDeep(item)
      action.isLeftSet === true ? newItem.firstSet.push(toAdd) : newItem.secondSet.push(toAdd)

      const leftItemDeletable = getLeftItemDeletable(newItem)
      newItem.firstSet.forEach(set => set._deletable = leftItemDeletable)
      const rightItemDeletable = getRightItemDeletable(newItem)
      newItem.secondSet.forEach(set => set._deletable = rightItemDeletable)

      return newItem
    }

    case UPDATE_SET: {
      // type could be updated... but how ? text/html is always true ?
      const newItem = cloneDeep(item)
      let set = null
      if (action.isLeftSet) {
        set = newItem.firstSet.find(set => set.id === action.id)
      } else {
        set = newItem.secondSet.find(set => set.id === action.id)
      }
      set.data = action.value
      return newItem
    }

    case REMOVE_SET: {
      const newItem = cloneDeep(item)
      if (action.isLeftSet) {
        const setIndex = newItem.firstSet.findIndex(set => set.id === action.id)
        newItem.firstSet.splice(setIndex, 1)
      } else {
        const setIndex = newItem.secondSet.findIndex(set => set.id === action.id)
        newItem.secondSet.splice(setIndex, 1)
      }
      const solutionsToRemove = newItem.solutions.filter(solution => action.isLeftSet ? solution.firstSetId === action.id : solution.secondSetId === action.id)
      for(const solution of solutionsToRemove){
        const index = newItem.solutions.indexOf(solution)
        newItem.solutions.splice(index, 1)
      }
      const rightItemDeletable = getRightItemDeletable(newItem)
      newItem.firstSet.forEach(set => set._deletable = rightItemDeletable)
      const leftItemDeletable = getLeftItemDeletable(newItem)
      newItem.secondSet.forEach(set => set._deletable = leftItemDeletable)
      return newItem
    }
  }
  return item
}

function getRightItemDeletable(item){
  return (item.secondSet.length > 1 && item.firstSet.length > 1) || (item.secondSet.length > 2 && item.firstSet.length === 1)
}

function getLeftItemDeletable(item){
  return (item.secondSet.length > 1 && item.firstSet.length > 1) || (item.secondSet.length === 1 && item.firstSet.length > 2)
}

function validate(item) {
  const errors = {}
  // no blank item data
  if (item.firstSet.find(set => notBlank(set.data, true)) || item.secondSet.find(set => notBlank(set.data, true))) {
    errors.items = tex('match_item_empty_data_error')
  }

  // empty penalty
  if (chain(item.penalty, [notBlank, number])) {
    errors.items = tex('match_penalty_not_valid')
  }

  // penalty greater than 0 and negatives score on solutions
  if (item.penalty && item.penalty > 0 && item.solutions.length > 0 && item.solutions.filter(solution => solution.score < 0).length > 0) {
    errors.warning = tex('match_warning_penalty_and_negative_scores')
  }

  // at least one solution with a score that is greater than 0
  if (undefined === item.solutions.find(solution => solution.score > 0)) {
    errors.items = tex('match_no_valid_solution')
  }
  // each solution should have a valid score
  if (undefined !== item.solutions.find(solution => chain(solution.score, [notBlank, number]))) {
    errors.items = tex('match_score_not_valid')
  }
  return errors
}


export default {
  type: 'application/x.match+json',
  name: 'match',
  component,
  reduce,
  validate
}
