import cloneDeep from 'lodash/cloneDeep'

import {makeReducer} from '#/main/core/scaffolding/reducer'

import {
  KEYWORD_ADD,
  KEYWORD_UPDATE,
  KEYWORD_REMOVE
} from '#/plugin/claco-form/resources/claco-form/editor/keyword/actions'

const reducer = makeReducer({}, {
  [KEYWORD_ADD]: (state, action) => {
    const keywords = cloneDeep(state)
    keywords.push(action.keyword)

    return keywords
  },
  [KEYWORD_UPDATE]: (state, action) => {
    const keywords = cloneDeep(state)
    const index = keywords.findIndex(k => k.id === action.keyword.id)

    if (index >= 0) {
      keywords[index] = action.keyword
    }

    return keywords
  },
  [KEYWORD_REMOVE]: (state, action) => {
    const keywords = cloneDeep(state)
    const index = keywords.findIndex(k => k.id === action.keywordId)

    if (index >= 0) {
      keywords.splice(index, 1)
    }

    return keywords
  }
})

export {
  reducer
}