import {SetForm as component} from './set.jsx'
import {ITEM_CREATE} from './../actions'
import {makeId, makeActionCreator} from './../util'
import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import set from 'lodash/set'
import {tex} from './../lib/translate'
import {notBlank, number, chain} from './../lib/validate'


const UPDATE_PROP = 'UPDATE_PROP'
const ADD_ITEM = 'ADD_ITEM'
const REMOVE_ITEM = 'REMOVE_ITEM'
const UPDATE_ITEM = 'UPDATE_ITEM'
const ADD_SET = 'ADD_SET'
const UPDATE_SET = 'UPDATE_SET'
const REMOVE_SET = 'REMOVE_SET'

const ADD_ODD = 'ADD_ODD'
const UPDATE_ODD = 'UPDATE_ODD'
const REMOVE_ODD = 'REMOVE_ODD'

export const actions = {
  updateProperty: makeActionCreator(UPDATE_PROP, 'property', 'value'),
  addItem:  makeActionCreator(ADD_ITEM),
  removeItem:  makeActionCreator(REMOVE_ITEM, 'id'),
  updateItem:  makeActionCreator(UPDATE_ITEM, 'id', 'property', 'value'),
  addSet:  makeActionCreator(ADD_SET),
  removeSet:  makeActionCreator(REMOVE_SET, 'id'),
  updateSet:  makeActionCreator(UPDATE_SET, 'id', 'property', 'value'),
  addOdd:  makeActionCreator(ADD_ODD),
  removeOdd:  makeActionCreator(REMOVE_ODD, 'id'),
  updateOdd:  makeActionCreator(UPDATE_ODD, 'id', 'property', 'value'),
}

function decorate(item) {

  const itemsWithDeletable = item.items.map(
    el => Object.assign({}, el, {
      _deletable: item.items.length > 1
    })
  )

  const setsWithDeletable = item.sets.map(
    el => Object.assign({}, el, {
      _deletable: item.sets.length > 1
    })
  )

  let decorated = Object.assign({}, item, {
    items: itemsWithDeletable,
    sets: setsWithDeletable
  })

  return decorated
}

function reduce(item = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {
      return decorate(Object.assign({}, item, {
        random: false,
        penalty: 0,
        sets: [
          {
            id: makeId(),
            type: 'text/html',
            data: 'SET A'
          }
        ],
        items: [
          {
            id: makeId(),
            type: 'text/html',
            data: 'ITEM A'
          }
        ],
        solutions: {
          associations: [],
          odds: [
            {
              id: makeId(),
              type: 'text/html',
              data: 'ODD A',
              score:0,
              feedback:''
            }
          ]
        }
      }))
    }

    case ADD_ITEM: {
      const newItem = cloneDeep(item)
      const toAdd = {
        id: makeId(),
        type: 'text/html',
        data: ''
      }

      newItem.items.push(toAdd)
      newItem.items.forEach(item => item._deletable = newItem.items.length > 1)
      return newItem
    }

    case UPDATE_ITEM: {
      const newItem = cloneDeep(item)
      const item = newItem.items.find(item => item.id === action.id)
      item[action.property] = action.value
      // mark items as touched
      newItem.items._touched = merge(
        newItem.items._touched || {},
        set({}, action.property, true)
      )
      newItem.items.forEach(item => item._deletable = newItem.items.length > 1)
      return newItem
    }

    case REMOVE_ITEM: {
      const newItem = cloneDeep(item)
      const index = newItem.items.findIndex(item => item.id === action.id)
      newItem.items.splice(index, 1)
      newItem.items.forEach(item => item._deletable = newItem.items.length > 1)
      return newItem
    }

    case ADD_SET: {
      const newItem = cloneDeep(item)
      const toAdd = {
        id: makeId(),
        type: 'text/html',
        data: ''
      }

      newItem.sets.push(toAdd)
      newItem.sets.forEach(set => set._deletable = newItem.sets.length > 1)
      return newItem
    }

    case UPDATE_SET: {
      const newItem = cloneDeep(item)
      const set = newItem.sets.find(set => set.id === action.id)
      set[action.property] = action.value
      // mark items as touched
      newItem.sets._touched = merge(
        newItem.sets._touched || {},
        set({}, action.property, true)
      )
      return newItem
    }

    case REMOVE_SET: {
      const newItem = cloneDeep(item)
      const index = newItem.sets.findIndex(set => set.id === action.id)
      newItem.sets.splice(index, 1)
      newItem.sets.forEach(set => set._deletable = newItem.sets.length > 1)
      return newItem
    }

    case ADD_ODD: {
      const newItem = cloneDeep(item)
      const toAdd = {
        id: makeId(),
        type: 'text/html',
        data:'',
        score: 0,
        feedback: ''
      }

      newItem.solutions.odds.push(toAdd)
      return newItem
    }

    case REMOVE_ODD: {
      const newItem = cloneDeep(item)
      const index = newItem.solutions.odds.findIndex(odd => odd.id === action.id)
      newItem.solutions.odds.splice(index, 1)
      return newItem
    }

    case UPDATE_ODD: {
      const newItem = cloneDeep(item)
      const odd = newItem.solutions.odds.find(odd => odd.id === action.id)
      odd[action.property] = action.value
      // mark items as touched
      newItem.solutions.odds._touched = merge(
        newItem.solutions.odds._touched || {},
        set({}, action.property, true)
      )
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
  }
  return item
}

function validate(item) {
  const errors = {}


  return errors
}


export default {
  type: 'application/x.set+json',
  name: 'set',
  component,
  reduce,
  validate
}
