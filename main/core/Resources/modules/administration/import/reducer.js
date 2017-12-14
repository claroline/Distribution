import {makeReducer} from '#/main/core/utilities/redux'
import {makeFormReducer} from '#/main/core/data/form/reducer'
import {UPDATE_IMPORT_DATA} from './actions'

const reducer = {
  explanation: makeReducer({}, {}),
  transfer: makeFormReducer('transfer.import', {}, {
    import: makeReducer(false, {
      [UPDATE_IMPORT_DATA]: (state, action) => {
        console.log("fit")
        return state
      }
    })
  })
}

export {
  reducer
}
