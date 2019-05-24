import {makeReducer} from '#/main/app/store/reducer'
import {makeFormReducer} from '#/main/app/content/form/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'
import {reducer as logReducer} from '#/main/core/transfer/log/reducer'

const reducer = {
  explanation: makeReducer({}),
  import: makeFormReducer('import'),
  export: makeFormReducer('export'),
  history: makeListReducer('history', {
    sortBy: {property: 'uploadDate', direction: -1}
  }),
  currentContext: makeReducer({}),
  log: logReducer
}

export {
  reducer
}
