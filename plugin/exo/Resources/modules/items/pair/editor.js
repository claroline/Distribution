import cloneDeep from 'lodash/cloneDeep'
import {ITEM_CREATE} from './../../quiz/editor/actions'
import {makeId, makeActionCreator} from './../../utils/utils'
import {notBlank, number, chain} from './../../utils/validate'
import {tex} from './../../utils/translate'
import {utils} from './utils/utils'
import {PairForm as component} from './editor.jsx'

const UPDATE_PROP = 'UPDATE_PROP'
const ADD_ITEM = 'ADD_ITEM'
const REMOVE_ITEM = 'REMOVE_ITEM'
const UPDATE_ITEM = 'UPDATE_ITEM'
const ADD_PAIR = 'ADD_PAIR'
const REMOVE_PAIR = 'REMOVE_PAIR'
const UPDATE_PAIR = 'UPDATE_PAIR'
const DROP_PAIR_ITEM = 'DROP_PAIR_ITEM'

export const actions = {
  updateProperty: makeActionCreator(UPDATE_PROP, 'property', 'value'),
  addItem:  makeActionCreator(ADD_ITEM, 'isOdd'),
  removeItem:  makeActionCreator(REMOVE_ITEM, 'id', 'isOdd'),
  updateItem:  makeActionCreator(UPDATE_ITEM, 'id', 'property', 'value', 'isOdd'),
  addPair: makeActionCreator(ADD_PAIR),
  removePair: makeActionCreator(REMOVE_PAIR, 'leftId', 'rightId'),
  updatePair: makeActionCreator(UPDATE_PAIR, 'index', 'property', 'value'),
  dropPairItem: makeActionCreator(DROP_PAIR_ITEM, 'pairData', 'itemData')
}

function decorate(pair) {

  // at least 2 "real" items (ie not odds)
  const itemDeletable = utils.getRealItemlist(pair.items, pair.solutions).length > 2
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
        solutions: [
          {
            itemIds: [-1, -1],
            score: 1,
            feedback: '',
            ordered: false,
            _deletable: false
          }
        ]
      }))
    }

    case UPDATE_PROP: {
      const newItem = cloneDeep(pair)
      const value = action.property === 'penalty' ? parseFloat(action.value) : Boolean(action.value)
      newItem[action.property] = value
      return newItem
    }

    case ADD_ITEM: {
      const newItem = cloneDeep(pair)
      const id = makeId()
      newItem.items.push({
        id: id,
        type: 'text/html',
        data: ''
      })

      if(action.isOdd) {
        const oddSolutionToAdd = {
          itemIds: [id],
          score: 0,
          feedback: ''
        }
        newItem.solutions.push(oddSolutionToAdd)
      }

      const itemDeletable = utils.getRealItemlist(newItem.items, newItem.solutions).length > 2
      newItem.items.forEach(el => el._deletable = itemDeletable)

      return newItem
    }

    case UPDATE_ITEM: {
      const newItem = cloneDeep(pair)

      const value = action.property === 'score' ? parseFloat(action.value) : action.value
      const itemToUpdate = newItem.items.find(el => el.id === action.id)
      // if it's a real item only data can be updated
      if(!action.isOdd){
        itemToUpdate[action.property] = value
        // update pair item data
        newItem.solutions.map((solution) => {
          const solutionItemIdIndex = solution.itemIds.findIndex(id => id === action.id)
          if(-1 < solutionItemIdIndex){
            solution._data = action.value
          }
        })
      } else {
        if (action.property === 'data') {
          itemToUpdate[action.property] = value
        } else {
          const oddSolution = newItem.solutions.find(el => el.itemIds[0] === action.id)
          oddSolution[action.property] = value
        }
      }

      return newItem
    }

    case REMOVE_ITEM: {

      const newItem = cloneDeep(pair)
      const itemIndex = newItem.items.findIndex(el => el.id === action.id)
      newItem.items.splice(itemIndex, 1)
      if(action.isOdd){
        // remove item from solution odds
        const oddList = utils.getOddlist(newItem.items, newItem.solutions)
        oddList.forEach((odd) => {
          if(odd.itemIds[0] === action.id){
            const idx = newItem.solutions.findIndex(el => el.itemIds[0] === action.id)
            newItem.solutions.splice(idx, 1)
          }
        })
      } else {
        // handle deletable state
        const itemDeletable = utils.getRealItemlist(newItem.items, newItem.solutions).length > 2
        newItem.items.forEach(el => el._deletable = itemDeletable)
        // remove item from solution associations
        const solutions = cloneDeep(newItem.solutions)
        solutions.forEach((solution) => {
          const solutionItemIdIndex = solution.itemIds.findIndex(id => id === action.id)
          if(-1 < solutionItemIdIndex){
            const solutionItem = newItem.solutions.find(el => el.itemIds[solutionItemIdIndex] === action.id)
            solutionItem.itemIds.splice(solutionItemIdIndex, 1)
          }
        })
      }

      return newItem
    }

    case ADD_PAIR: {
      const newItem = cloneDeep(pair)
      newItem.solutions.push({
        itemIds: [-1, -1],
        score: 1,
        feedback: '',
        ordered: false
      })

      const realSolutions = utils.getRealSolutionList(newItem.solutions)
      realSolutions.forEach(solution => {
        solution._deletable = realSolutions.length > 1
      })
      return newItem
    }

    case REMOVE_PAIR: {
      const newItem = cloneDeep(pair)
      const idxToRemove = newItem.solutions.findIndex(solution => solution.itemIds[0] === action.leftId && solution.itemIds[1] === action.rightId)
      newItem.solutions.splice(idxToRemove, 1)
      return newItem
    }

    case UPDATE_PAIR: {
      const newItem = cloneDeep(pair)
      // 'index', 'property', 'value'
      // can update score feedback and coordinates
      const value = action.property === 'score' ? parseFloat(action.value) : action.value
      const solutionToUpdate = utils.getRealSolutionList(newItem.solutions)[action.index] //newItem.solutions.find(solution => solution.itemIds[0] === action.leftId && solution.itemIds[1] === action.rightId)
      solutionToUpdate[action.property] = value
      return newItem
    }

    case DROP_PAIR_ITEM: {
      const newItem = cloneDeep(pair)
      // pairData = pair data + position of item dropped (0 / 1) + index (index of real solution)
      // itemData = dropped item data
      const realSolutionList = utils.getRealSolutionList(newItem.solutions)
      const existingSolution = realSolutionList[action.pairData.index]
      existingSolution.itemIds[action.pairData.position] = action.itemData.id

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
