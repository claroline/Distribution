import {makeReducer} from '#/main/core/utilities/redux'
import {makeFormReducer} from '#/main/core/data/form/reducer'

const reducer = {
  explanation: makeReducer({}, {}),
  transfer: makeFormReducer('transfer.import')
}

export {
  reducer
}
