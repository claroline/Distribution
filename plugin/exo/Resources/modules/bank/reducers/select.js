import {makeReducer} from './../../utils/reducers'

import {
  ITEMS_SELECT,
  ITEM_SELECT,
  ITEM_DESELECT,
  ITEM_DESELECT_ALL
} from './../actions/select'

function selectItems() {

}

function selectItem() {

}

function deselectItem() {

}

function deselectAll() {
  return []
}


const selectReducer = makeReducer([], {
  [ITEMS_SELECT]: selectItems,
  [ITEM_SELECT]: selectItem,
  [ITEM_DESELECT]: deselectItem,
  [ITEM_DESELECT_ALL]: deselectAll
})

export default selectReducer