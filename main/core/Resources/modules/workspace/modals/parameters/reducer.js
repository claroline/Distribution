import {makeFormReducer} from '#/main/core/data/form/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'

const reducer = {
  parameters: makeFormReducer('parameters'),
  resourcesPicker: makeListReducer('resourcesPicker')
}

export {
  reducer
}
