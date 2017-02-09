import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import {ITEM_CREATE} from './../../quiz/editor/actions'
import {SCORE_FIXED} from './../../quiz/enums'
import {makeActionCreator, makeId} from './../../utils/utils'
import {tex} from './../../utils/translate'
import {notBlank} from './../../utils/validate'
import {Grid as component} from './editor.jsx'

const UPDATE_PROP = 'UPDATE_PROP'

export const SUM_CELL = 'cell'
export const SUM_COL = 'col'
export const SUM_ROW = 'row'

export const actions = {
  updateProperty: makeActionCreator(UPDATE_PROP, 'property', 'value')
}

function decorate(item) {


  return item
}

function reduce(item = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {
      return decorate(Object.assign({}, item, {
        multiple: false,
        random: false,
        penalty: 0,
        sumMode: {
          SUM_CELL
        },
        cells: [
          {
            id: makeId(),
            data: '',
            coordinates: [0, 0],
            background: '#fff',
            color: '#000'
          }
        ],
        rows: 1,
        cols: 1,
        border: {

        },
        solutions: []
      }))
    }
    case UPDATE_PROP: {
      // action.property action.value
      const newItem = cloneDeep(item)
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
  component,
  reduce,
  decorate,
  validate
}
