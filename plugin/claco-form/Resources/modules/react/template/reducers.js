import {makeReducer} from '#/main/core/utilities/redux'
import {TEMPLATE_UPDATE} from './actions'

const templateReducers = makeReducer({}, {
  [TEMPLATE_UPDATE]: (state, action) => {
    return action.template
  }
})

export {
  templateReducers
}