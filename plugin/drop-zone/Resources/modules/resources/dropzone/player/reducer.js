import cloneDeep from 'lodash/cloneDeep'
import {makeReducer} from '#/main/core/utilities/redux'

import {
  MY_DROP_LOAD,
  MY_DROP_UPDATE,
  DOCUMENTS_ADD,
  DOCUMENT_REMOVE
} from './actions'

const myDropReducer = makeReducer({}, {
  [MY_DROP_LOAD]: (state, action) => {
    return action.drop
  },
  [MY_DROP_UPDATE]: (state, action) => {
    return Object.assign({}, state, {[action.property]: action.value})
  },
  [DOCUMENTS_ADD]: (state, action) => {
    const documents = cloneDeep(state.documents)
    action.documents.forEach(d => documents.push(d))

    return Object.assign({}, state, {documents: documents})
  },
  [DOCUMENT_REMOVE]: (state, action) => {
    const documents = cloneDeep(state.documents)
    const index = documents.findIndex(d => d.id === action.documentId)

    if (index > -1) {
      documents.splice(index, 1)
    }

    return Object.assign({}, state, {documents: documents})
  }
})

const myDropsReducer = makeReducer({}, {})

const reducer = {
  myDrop: myDropReducer,
  myDrops: myDropsReducer
}

export {
  reducer
}
