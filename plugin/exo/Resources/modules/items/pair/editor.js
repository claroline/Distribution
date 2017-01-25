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

  // at least 2 "real" items (ie not odds)
  const itemDeletable = pair.items.filter(
    item => undefined === pair.solutions.find(
      solution => solution.itemIds.length === 1 && solution.itemIds[0] === item.id
    )
  ).length > 1

  const itemsWithDeletable = pair.items.map(
    item => Object.assign({}, item, {
      _deletable: itemDeletable
    })
  )

  let decorated = Object.assign({}, pair, {
    items: itemsWithDeletable
  })

  return decorated
}

function reduce(pair = {}, action) {
  switch (action.type) {

    case ITEM_CREATE: {
      return decorate(Object.assign({}, pair, {
        random: false,
        penalty: 0,
        items: [
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
