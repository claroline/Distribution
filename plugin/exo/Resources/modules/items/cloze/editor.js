import {Cloze as component} from './editor.jsx'
import {makeActionCreator} from './../../utils/utils'

export const actions = {
  updateProperty: makeActionCreator(UPDATE_TEXT, 'text')
}

export default {
  component,
  reduce
}

const UPDATE_TEXT = 'UPDATE_TEXT'

function reduce(item = {}, action) {
  switch (action.type) {
    case UPDATE_TEXT: {
      alert('test')
    }
  }
}
