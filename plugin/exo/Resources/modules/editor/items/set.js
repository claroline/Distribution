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

const ADD_ASSOCIATION = 'ADD_ASSOCIATION'
const UPDATE_ASSOCIATION = 'UPDATE_ASSOCIATION'
const REMOVE_ASSOCIATION = 'REMOVE_ASSOCIATION'

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
  addAssociation: makeActionCreator(ADD_ASSOCIATION, 'setId', 'itemId', 'itemData'),
  removeAssociation: makeActionCreator(REMOVE_ASSOCIATION, 'setId', 'itemId'),
  updateAssociation: makeActionCreator(UPDATE_ASSOCIATION, 'setId', 'itemId', 'property', 'value')
}

function decorate(question) {

  const itemsWithDeletable = question.items.map(
    item => Object.assign({}, item, {
      _deletable: question.items.length > 1
    })
  )

  const setsWithDeletable = question.sets.map(
    item => Object.assign({}, item, {
      _deletable: question.sets.length > 1
    })
  )

  // solutions associations ? add solution item data
  const associationsWithItemData = getAssociationsWithItemData(question)

  let decorated = Object.assign({}, question, {
    items: itemsWithDeletable,
    sets: setsWithDeletable,
    solutions: Object.assign({}, question.solutions, {
      associations: associationsWithItemData
    })
  })

  return decorated
}

function getAssociationsWithItemData(item){

  item.solutions.associations.forEach(
    (association) => {
      const questionItem = item.items.find(el => el.id === association.itemId)
      const data = questionItem !== undefined ? questionItem.data : ''
      Object.assign({}, association, {
        _itemData: data
      })
    }
  )

  return item.solutions.associations
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
            data: 'ITEM A',
            _deletable: false
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
      newItem.items.forEach(el => el._deletable = newItem.items.length > 1)
      return newItem
    }

    case UPDATE_ITEM: {
      const newItem = cloneDeep(item)
      const toUpdate = newItem.items.find(el => el.id === action.id)
      toUpdate[action.property] = action.value
      // mark items as touched
      newItem.items._touched = merge(
        newItem.items._touched || {},
        set({}, action.property, true)
      )

      // update associations item data
      newItem.solutions.associations.map((ass) => {
        if(ass.itemId === action.id){
          ass._itemData = action.value.length > 15 ? action.value.substring(0, 12) + '...' : action.value
        }
      })

      newItem.items.forEach(el => el._deletable = newItem.items.length > 1)
      return newItem
    }

    case REMOVE_ITEM: {
      const newItem = cloneDeep(item)
      const index = newItem.items.findIndex(item => item.id === action.id)
      newItem.items.splice(index, 1)
      newItem.items.forEach(item => item._deletable = newItem.items.length > 1)
      // remove item from solution
      newItem.solutions.associations.forEach((ass, index) => {
        if(ass.itemId === action.id){
          // remove
          newItem.solutions.associations.splice(index, 1)
        }
      })

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
      // remove set from solution
      newItem.solutions.associations.forEach((ass, index) => {
        if(ass.setId === action.id){
          // remove
          newItem.solutions.associations.splice(index, 1)
        }
      })

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

    case ADD_ASSOCIATION: {
      const newItem = cloneDeep(item)
      const toAdd = {
        itemId: action.itemId,
        setId: action.setId,
        score: 0,
        feedback: '',
        _itemData: action.itemData.length > 15 ? action.itemData.substring(0, 12) + '...' : action.itemData
      }
      newItem.solutions.associations.push(toAdd)
      return newItem
    }

    case REMOVE_ASSOCIATION: {
      const newItem = cloneDeep(item)
      const index = newItem.solutions.associations.findIndex(el => el.itemId === action.itemId && el.setId === action.setId)
      newItem.solutions.associations.splice(index, 1)
      return newItem
    }

    case UPDATE_ASSOCIATION: {
      const newItem = cloneDeep(item)
      const value = action.property === 'score' ? parseFloat(action.value) : action.value
      const association = newItem.solutions.associations.find(el => el.setId === action.setId && el.itemId === action.itemId)
      association[action.property] = value
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
