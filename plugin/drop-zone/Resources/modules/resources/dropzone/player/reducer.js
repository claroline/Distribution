import cloneDeep from 'lodash/cloneDeep'

import {makeReducer} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'

import {RESOURCE_LOAD} from '#/main/core/resource/store/actions'

import {select} from '#/plugin/drop-zone/resources/dropzone/store/selectors'

import {
  MY_DROP_LOAD,
  MY_DROP_UPDATE,
  DOCUMENTS_ADD,
  DOCUMENT_UPDATE,
  DOCUMENT_REMOVE,
  PEER_DROP_LOAD,
  PEER_DROP_RESET,
  PEER_DROPS_INC,
  REVISION_LOAD,
  REVISION_RESET,
  REVISION_COMMENT_UPDATE
} from '#/plugin/drop-zone/resources/dropzone/player/actions'
import {
  DROP_UPDATE,
  CORRECTION_UPDATE
} from '#/plugin/drop-zone/resources/dropzone/correction/actions'

const myDropReducer = makeReducer({}, {
  [RESOURCE_LOAD]: (state, action) => action.resourceData.myDrop,
  [MY_DROP_LOAD]: (state, action) => action.drop,
  [MY_DROP_UPDATE]: (state, action) => {
    return Object.assign({}, state, {[action.property]: action.value})
  },
  [DROP_UPDATE]: (state, action) => {
    return state && state.id === action.drop.id ? action.drop : state
  },
  [DOCUMENTS_ADD]: (state, action) => {
    // When adding a new document, all documents from previous revision is archived in the revision
    const documents = cloneDeep(state.documents.filter(d => !d.revision))
    action.documents.forEach(d => documents.push(d))

    return Object.assign({}, state, {documents: documents})
  },
  [DOCUMENT_UPDATE]: (state, action) => {
    const documents = cloneDeep(state.documents)
    const index = documents.findIndex(d => d.id === action.document.id)

    if (index > -1) {
      documents[index] = action.document
    }

    return Object.assign({}, state, {documents: documents})
  },
  [DOCUMENT_REMOVE]: (state, action) => {
    const documents = cloneDeep(state.documents)
    const index = documents.findIndex(d => d.id === action.documentId)

    if (index > -1) {
      documents.splice(index, 1)
    }

    return Object.assign({}, state, {documents: documents})
  },
  [CORRECTION_UPDATE]: (state, action) => {
    if (state && state.id === action.correction.drop) {
      const corrections = cloneDeep(state.corrections)
      const index = corrections.findIndex(c => c.id === action.correction.id)

      if (index > -1) {
        corrections[index] = action.correction
      } else {
        corrections.push(action.correction)
      }

      return Object.assign({}, state, {corrections: corrections})
    } else {
      return state
    }
  }
})

const nbCorrectionsReducer = makeReducer({}, {
  [RESOURCE_LOAD]: (state, action) => action.resourceData.nbCorrections,
  [PEER_DROPS_INC]: (state) => {
    return state + 1
  }
})

const peerDropReducer = makeReducer(null, {
  [CORRECTION_UPDATE]: (state, action) => {
    if (state && state.id === action.correction.drop) {
      const corrections = cloneDeep(state.corrections)
      const index = corrections.findIndex(c => c.id === action.correction.id)

      if (index > -1) {
        corrections[index] = action.correction
      } else {
        corrections.push(action.correction)
      }

      return Object.assign({}, state, {corrections: corrections})
    } else {
      return state
    }
  },
  [PEER_DROP_LOAD]: (state, action) => {
    return action.drop
  },
  [PEER_DROP_RESET]: () => {
    return null
  },
  [DROP_UPDATE]: (state, action) => {
    return state && state.id === action.drop.id ? action.drop : state
  }
})

const revisionReducer = makeReducer(null, {
  [REVISION_LOAD]: (state, action) => {
    return action.revision
  },
  [REVISION_RESET]: () => {
    return null
  },
  [REVISION_COMMENT_UPDATE]: (state, action) => {
    const newRevision = cloneDeep(state)
    const commentIdx = newRevision.comments.findIndex(c => c.id === action.comment.id)

    if (-1 < commentIdx) {
      newRevision.comments[commentIdx] = action.comment
    } else {
      newRevision.comments.push(action.comment)
    }

    return newRevision
  }
})

const currentRevisionIdReducer = makeReducer(null, {
  [RESOURCE_LOAD]: (state, action) => action.resourceData.currentRevisionId
})

const reducer = {
  myDrop: myDropReducer,
  nbCorrections: nbCorrectionsReducer,
  peerDrop: peerDropReducer,
  myRevisions: makeListReducer(select.STORE_NAME+'.myRevisions'),
  revisions: makeListReducer(select.STORE_NAME+'.revisions'),
  revision: revisionReducer,
  currentRevisionId: currentRevisionIdReducer
}

export {
  reducer
}
