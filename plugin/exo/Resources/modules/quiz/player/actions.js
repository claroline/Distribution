
export const ITEM_OPEN = 'ITEM_OPEN'

export const actions = {}

actions.openItem = (id, type) => {
  return {
    type: ITEM_OPEN,
    id: id,
    itemType: type
  }
}
