
import validate from './validators'
import {decorateItem} from './../decorators'
import {update} from './../../utils/utils'
import {getDefinition} from './../../items/item-types'
import ITEM_OPEN from './actions'

function reduceItems(items = {}, action = {}) {
  switch (action.type) {
    case ITEM_OPEN: {
      let newItem = decorateItem({
        id: action.id,
        type: action.itemType,
        content: '',
        hints: [],
        feedback: ''
      })
      newItem = decorateItem(newItem)
      const def = getDefinition(action.itemType)
      newItem = def.player.reduce(newItem, action)
      const errors = validate.item(newItem)
      newItem = Object.assign({}, newItem, {_errors: errors})

      return update(items, {[action.id]: {$set: newItem}})
    }
  }
  return items
}

export const reducers = {
  items: reduceItems
}
