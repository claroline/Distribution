import cloneDeep from 'lodash/cloneDeep'
import {ITEM_CREATE} from './../../quiz/editor/actions'
import {makeId, makeActionCreator} from './../../utils/utils'
import {notBlank, number, chain} from './../../utils/validate'
import {tex} from './../../utils/translate'
import {PairForm as component} from './editor.jsx'

const UPDATE_PROP = 'UPDATE_PROP'
const ADD_ITEM = 'ADD_ITEM'
const REMOVE_ITEM = 'REMOVE_ITEM'
const UPDATE_ITEM = 'UPDATE_ITEM'
const ADD_SOLUTION = 'ADD_SOLUTION'
const REMOVE_SOLUTION = 'REMOVE_SOLUTION'
const UPDATE_SOLUTION = 'UPDATE_SOLUTION'

export const actions = {
  updateProperty: makeActionCreator(UPDATE_PROP, 'property', 'value'),
  addItem:  makeActionCreator(ADD_ITEM, 'isRightItem', 'isOdd'),
  removeItem:  makeActionCreator(REMOVE_ITEM, 'id', 'isRightItem', 'isOdd'),
  updateItem:  makeActionCreator(UPDATE_ITEM, 'id', 'property', 'value', 'isOdd'),
  addSolution: makeActionCreator(ADD_SOLUTION, 'leftId', 'rightId', 'data'),
  removeSolution: makeActionCreator(REMOVE_SOLUTION, 'leftId', 'rightId'),
  updateSolution: makeActionCreator(UPDATE_SOLUTION, 'leftId', 'rightId', 'property', 'value')
}


function decorate(pair) {

  // consider items that are not in solutions.odd
  const itemDeletable = question.items.filter(item => undefined === question.solutions.odd.find(el => el.itemId === item.id)).length > 1
  const itemsWithDeletable = question.items.filter(item => undefined === question.solutions.odd.find(el => el.itemId === item.id)).map(
    item => Object.assign({}, item, {
      _deletable: itemDeletable
    })
  )

  const setsWithDeletable = question.sets.map(
    item => Object.assign({}, item, {
      _deletable: question.sets.length > 1
    })
  )
  let decorated = Object.assign({}, question, {
    items: itemsWithDeletable,
    sets: setsWithDeletable,
    solutions: Object.assign({}, question.solutions, {
      associations: associationsWithItemData
    })
  })

  return decorated
}

function reduce(pair = {}, action) {
  switch (action.type) {

    case ITEM_CREATE: {
      return decorate(Object.assign({}, pair, {
        random: false,
        penalty: 0,
        left: [
          {
            id: makeId(),
            type: 'text/html',
            data: ''
          }
        ],
        right: [
          {
            id: makeId(),
            type: 'text/html',
            data: ''
          }
        ],
        solutions: []
      }))
    }

    case UPDATE_PROP: {
      const newItem = cloneDeep(pair)
      return newItem
    }

    case ADD_ITEM: {
      const newItem = cloneDeep(pair)
      return newItem
    }

    case UPDATE_ITEM: {
      const newItem = cloneDeep(pair)
      return newItem
    }

    case REMOVE_ITEM: {
      const newItem = cloneDeep(pair)
      return newItem
    }

    case ADD_SOLUTION: {
      const newItem = cloneDeep(pair)
      return newItem
    }

    case REMOVE_SOLUTION: {
      const newItem = cloneDeep(pair)
      return newItem
    }

    case UPDATE_SOLUTION: {
      const newItem = cloneDeep(pair)
      return newItem
    }

  }
  return pair
}

function validate(pair) {
  const errors = {}

  return errors
}

export default {
  component,
  reduce,
  decorate,
  validate
}
