import {makeFormReducer} from '#/main/core/data/form/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'
import {makeReducer} from '#/main/core/scaffolding/reducer'

import {
  KEYWORD_ADD,
  KEYWORD_UPDATE,
  KEYWORDS_REMOVE
} from '#/plugin/claco-form/resources/claco-form/editor/actions'

const reducer = makeFormReducer('clacoFormForm', {}, {
  categories: makeListReducer('clacoFormForm.categories', {}, {}),
  keywords: makeListReducer('clacoFormForm.keywords', {}, {
    invalidated: makeReducer(false, {
      [KEYWORD_ADD]: () => true,
      [KEYWORD_UPDATE]: () => true,
      [KEYWORDS_REMOVE]: () => true
    })
  })
})

export {
  reducer
}