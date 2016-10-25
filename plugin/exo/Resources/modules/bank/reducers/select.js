import {makeReducer} from './../../utils/reducers'

import {
  ITEMS_SELECT,
  ITEM_SELECT,
  ITEM_DESELECT,
  ITEM_DESELECT_ALL
} from './../actions/select'

function selectItems(selectedState, action = {}) {

}

function selectItem(selectedState, action = {}) {

}

function deselectItem(selectedState, action = {}) {

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