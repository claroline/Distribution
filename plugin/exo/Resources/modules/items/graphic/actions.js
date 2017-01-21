import invariant from 'invariant'
import {makeId, makeActionCreator} from './../../utils/utils'

export const SELECT_MODE = 'SELECT_MODE'
export const SELECT_IMAGE = 'SELECT_IMAGE'

export const actions = {}

actions.selectMode = makeActionCreator(SELECT_MODE, 'mode')

actions.selectImage = image => {
  invariant(image, 'image is mandatory')
  return {
    type: SELECT_IMAGE,
    image: Object.assign({}, image, {id: makeId()})
  }
}
