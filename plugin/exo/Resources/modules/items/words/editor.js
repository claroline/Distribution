import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'

import {Words as component} from './editor.jsx'
import {ITEM_CREATE} from './../../quiz/editor/actions'
import {makeActionCreator} from '#/main/core/utilities/redux'
import {keywords as keywordUtils} from './../../utils/keywords'

const UPDATE_SOLUTION = 'UPDATE_SOLUTION'
const ADD_SOLUTION = 'ADD_SOLUTION'
const REMOVE_SOLUTION = 'REMOVE_SOLUTION'
const UPDATE_PROP = 'UPDATE_PROP'

export const actions = {
  updateSolution: makeActionCreator(UPDATE_SOLUTION, 'keyword', 'property', 'value'),
  addSolution: makeActionCreator(ADD_SOLUTION),
  removeSolution: makeActionCreator(REMOVE_SOLUTION, 'keyword'),
  updateProperty: makeActionCreator(UPDATE_PROP, 'property', 'value')
}

function decorate(item) {
  const decoratedSolutions = item.solutions.map(
    solution => {
      solution = Object.assign({}, solution, {
        _deletable: item.solutions.length > 1
      })

      if (!solution.feedback) {
        solution = Object.assign({}, solution, {
          feedback: ''
        })
      }

      return solution
    }
  )

  let decorated = Object.assign({}, item, {
    _wordsCaseSensitive: false,
    solutions: decoratedSolutions
  })

  return decorated
}

function findKeyword(keywords, search) {
  return keywords.find(keyword => search.text === keyword.text && search.caseSensitive === keyword.caseSensitive)
}

function reduce(item = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {
      return decorate(Object.assign({}, item, {
        solutions: [
          {
            text:'',
            caseSensitive: false,
            score: 1,
            feedback: ''
          }
        ]
      }))
    }

    case UPDATE_SOLUTION: {
      const newItem = cloneDeep(item)
      const value = action.property === 'score' ? parseFloat(action.value) : action.value

      // Retrieve the keyword to update
      const keyword = findKeyword(newItem.solutions, action.keyword)
      if (keyword) {
        keyword[action.property] = value
      }

      return newItem
    }

    case ADD_SOLUTION: {
      const newItem = cloneDeep(item)
      newItem.solutions.push({
        text:'',
        caseSensitive: false,
        score: 1,
        feedback: ''
      })
      const deletable = newItem.solutions.length > 1
      newItem.solutions.forEach(solution => solution._deletable = deletable)
      return newItem
    }

    case REMOVE_SOLUTION: {
      const newItem = cloneDeep(item)

      const keyword = findKeyword(newItem.solutions, action.keyword)
      if (keyword) {
        newItem.solutions.splice(newItem.solutions.indexOf(keyword), 1)
        newItem.solutions.forEach(solution => solution._deletable = newItem.solutions.length > 1)
      }

      return newItem
    }

    case UPDATE_PROP: {
      // for now it is only used for casSensitive activation / deactivation
      const newItem = cloneDeep(item)
      newItem[action.property] = Boolean(action.value)
      if (false === Boolean(action.value)){
        newItem.solutions.forEach(solution => solution.caseSensitive = false)
      }

      return newItem
    }
  }
  return item
}

function validate(item) {
  const errors = {}

  // Checks keyword collection
  const keywordsErrors = keywordUtils.validate(item.solutions, true, 1)
  if (!isEmpty(keywordsErrors)) {
    errors.keywords = keywordsErrors
  }

  return errors
}

export default {
  component,
  reduce,
  validate,
  decorate
}
