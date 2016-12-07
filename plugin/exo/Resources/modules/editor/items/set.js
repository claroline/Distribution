import {SetForm as component} from './set.jsx'
import {ITEM_CREATE} from './../actions'
import {makeId, makeActionCreator} from './../util'
import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import set from 'lodash/set'
import {tex} from './../lib/translate'
import {notBlank, number, chain} from './../lib/validate'


const UPDATE_PROP = 'UPDATE_PROP'

// ITEM OR ODD
const ADD_ITEM = 'ADD_ITEM'
const REMOVE_ITEM = 'REMOVE_ITEM'
const UPDATE_ITEM = 'UPDATE_ITEM'

// SETS
const ADD_SET = 'ADD_SET'
const UPDATE_SET = 'UPDATE_SET'
const REMOVE_SET = 'REMOVE_SET'

// SOLUTIONS.ASSOCIATION
const ADD_ASSOCIATION = 'ADD_ASSOCIATION'
const UPDATE_ASSOCIATION = 'UPDATE_ASSOCIATION'
const REMOVE_ASSOCIATION = 'REMOVE_ASSOCIATION'

export const actions = {
  updateProperty: makeActionCreator(UPDATE_PROP, 'property', 'value'),
  addItem:  makeActionCreator(ADD_ITEM, 'isOdd'),
  removeItem:  makeActionCreator(REMOVE_ITEM, 'id', 'isOdd'),
  updateItem:  makeActionCreator(UPDATE_ITEM, 'id', 'property', 'value', 'isOdd'),
  addSet:  makeActionCreator(ADD_SET),
  removeSet:  makeActionCreator(REMOVE_SET, 'id'),
  updateSet:  makeActionCreator(UPDATE_SET, 'id', 'property', 'value'),
  addAssociation: makeActionCreator(ADD_ASSOCIATION, 'setId', 'itemId', 'itemData'),
  removeAssociation: makeActionCreator(REMOVE_ASSOCIATION, 'setId', 'itemId'),
  updateAssociation: makeActionCreator(UPDATE_ASSOCIATION, 'setId', 'itemId', 'property', 'value')
}

function decorate(question) {

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
            data: ''
          }
        ],
        items: [
          {
            id: makeId(),
            type: 'text/html',
            data: '',
            _deletable: false
          }
        ],
        solutions: {
          associations: [],
          odd: []
        }
      }))
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

    case ADD_ITEM: {
      const newItem = cloneDeep(item)
      const toAdd = {
        id: makeId(),
        type: 'text/html',
        data: ''
      }

      newItem.items.push(toAdd)

      if(action.isOdd) {
        const oddSolutionToAdd = {
          itemId: toAdd.id,
          score: 0,
          feedback: ''
        }
        newItem.solutions.odd.push(oddSolutionToAdd)
      }

      // consider items that are not in solutions.odd
      const itemDeletable = newItem.items.filter(item => undefined === newItem.solutions.odd.find(el => el.itemId === item.id)).length > 1
      newItem.items.filter(item => undefined === newItem.solutions.odd.find(el => el.itemId === item.id)).forEach(el => el._deletable = itemDeletable)
      return newItem
    }

    case UPDATE_ITEM: {
      const newItem = cloneDeep(item)

      const value = action.property === 'score' ? parseFloat(action.value) : action.value
      const itemToUpdate = newItem.items.find(el => el.id === action.id)
      // if it's a normal item only data can be updated
      if(!action.isOdd){
        itemToUpdate[action.property] = value
        // mark items as touched
        newItem._itemsTouched = merge(
          newItem._itemsTouched || {},
          set({}, action.property, true)
        )

        // update associations item data
        newItem.solutions.associations.map((ass) => {
          if(ass.itemId === action.id){
            ass._itemData = action.value.length > 15 ? action.value.substring(0, 12) + '...' : action.value
          }
        })
      } else {

        if (action.property === 'data') {
          itemToUpdate[action.property] = value
        } else {
          const oddSolution = newItem.solutions.odd.find(el => el.itemId = action.id)
          oddSolution[action.property] = value
        }
        // mark odd as touched
        newItem._oddTouched = merge(
          newItem._oddTouched || {},
          set({}, action.property, true)
        )
      }

      return newItem
    }

    case REMOVE_ITEM: {
      const newItem = cloneDeep(item)
      const itemIndex = newItem.items.findIndex(el => el.id === action.id)
      newItem.items.splice(itemIndex, 1)
      if(action.isOdd){
        // remove item from solution odds
        newItem.solutions.odd.forEach((odd, index) => {
          if(odd.itemId === action.id){
            // remove
            newItem.solutions.odd.splice(index, 1)
          }
        })
      } else {
        // consider items that are not in solutions.odd
        const itemDeletable = newItem.items.filter(item => undefined === newItem.solutions.odd.find(el => el.itemId === item.id)).length > 1
        newItem.items.filter(item => undefined === newItem.solutions.odd.find(el => el.itemId === item.id)).forEach(el => el._deletable = itemDeletable)
        // remove item from solution associations
        newItem.solutions.associations.forEach((ass, index) => {
          if(ass.itemId === action.id){
            // remove
            newItem.solutions.associations.splice(index, 1)
          }
        })
      }

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
      const toUpdate = newItem.sets.find(el => el.id === action.id)
      toUpdate[action.property] = action.value
      // mark sets as touched
      newItem._setTouched = merge(
        newItem._setTouched || {},
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


    case ADD_ASSOCIATION: {
      const newItem = cloneDeep(item)
      const toAdd = {
        itemId: action.itemId,
        setId: action.setId,
        score: 1,
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
      newItem._associationTouched = merge(
        newItem._associationTouched || {},
        set({}, action.property, true)
      )
      return newItem
    }

  }
  return item
}

function validate(item) {
  const errors = {}

  // penalty should be greater or equal to 0
  if (chain(item.penalty, [notBlank, number])) {
    errors.item = tex('set_penalty_not_valid')
  }

  // one item (that is not an odd) min
  if (item.items.filter(el => undefined === item.solutions.odd.find(odd => odd.itemId === el.id)).length === 0) {
    errors.items = tex('set_at_least_one_item')
  } else if (item.items.filter(el => undefined === item.solutions.odd.find(odd => odd.itemId === el.id)).find(item => notBlank(item.data, true))) {
    // item data should not be empty
    errors.items = tex('set_item_empty_data_error')
  }

  // one set min
  if (item.sets.length === 0) {
    errors.sets = tex('set_at_least_one_set')
  } else if (item.sets.find(set => notBlank(set.data, true))) {
    // set data should not be empty
    errors.sets = tex('set_set_empty_data_error')
  }

  if (item.solutions.associations.length === 0) {
    errors.solutions = tex('set_no_solution')
  } else if (undefined !== item.solutions.associations.find(association => chain(association.score, [notBlank, number]))) {
    // each solution should have a valid score
    errors.solutions = tex('set_score_not_valid')
  } else if (undefined === item.solutions.associations.find(association => association.score > 0)) {
    // at least one solution with a score that is greater than 0
    errors.solutions = tex('set_no_valid_solution')
  }

  // odd
  if (item.solutions.odd.length > 0) {
    // odd score not empty and valid number
    if(undefined !== item.solutions.odd.find(odd => chain(odd.score, [notBlank, number]))) {
      errors.odd = tex('set_score_not_valid')
    } else if (undefined !== item.solutions.odd.find(odd => odd.score > 0)) {
      errors.odd = tex('set_odd_score_not_valid')
    }
    // odd data not empty
    if (item.items.filter(el => undefined !== item.solutions.odd.find(odd => odd.itemId === el.id)).find(odd => notBlank(odd.data, true))) {
      // set data should not be empty
      errors.odd = tex('set_odd_empty_data_error')
    }
  }

  return errors
}


export default {
  type: 'application/x.set+json',
  name: 'set',
  component,
  reduce,
  validate
}
