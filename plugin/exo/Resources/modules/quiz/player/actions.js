
import {makeActionCreator} from './../../utils/utils'

export const ITEM_OPEN = 'ITEM_OPEN'

export const actions = {}

actions.openItem = (id, type) => {

  //invariant(type, 'type is mandatory')
  return {
    type: ITEM_OPEN,
    id: id,
    itemType: type
  }
}

//actions.openItem = makeActionCreator(ITEM_OPEN, 'id')
