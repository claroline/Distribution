import {notBlank, setIfError} from './../../utils/validate'
import {getDefinition} from './../../items/item-types'

function validateItem(item) {
  const errors = validateBaseItem(item)
  const subErrors = getDefinition(item.type).player.validate(item)

  return Object.assign(errors, subErrors)
}

function validateBaseItem(item) {
  const errors = {}

  setIfError(errors, 'content', notBlank(item.content, true))

  return errors
}

export default {
  item: validateItem
}
