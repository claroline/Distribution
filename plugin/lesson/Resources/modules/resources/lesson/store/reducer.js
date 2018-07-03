import {makeReducer, combineReducers} from '#/main/core/scaffolding/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'
import {FORM_SUBMIT_SUCCESS} from '#/main/core/data/form/actions'
import {
  SUMMARY_PIN_TOGGLE,
  SUMMARY_OPEN_TOGGLE
} from '#/plugin/path/resources/path/actions'
import {
  CHAPTER_LOAD,
  CHAPTER_RESET,
  CHAPTER_CREATE,
  CHAPTER_EDIT,
  TREE_LOADED
} from '#/plugin/lesson/resources/lesson/store/actions'
import {constants} from '#/plugin/lesson/resources/lesson/constants'

const reducer = {
  summary: combineReducers({
    pinned: makeReducer(false, {
      [SUMMARY_PIN_TOGGLE]: (state) => !state
    }),
    opened: makeReducer(false, {
      [SUMMARY_OPEN_TOGGLE]: (state) => !state
    })
  }),
  lesson: makeReducer({}, {}),
  chapter: makeReducer({}, {
    [CHAPTER_LOAD]: (state, action) => action.chapter,
    [CHAPTER_RESET]: () => ({})
  }),
  chapter_edit: makeFormReducer(constants.CHAPTER_EDIT_FORM_NAME),
  mode: makeReducer('', {
    [CHAPTER_CREATE]: () => constants.CREATE_CHAPTER,
    [CHAPTER_EDIT]: () => constants.EDIT_CHAPTER,
    [CHAPTER_LOAD]: () => constants.VIEW_CHAPTER
  }),
  exportPdfEnabled: makeReducer(false, {}),
  tree: combineReducers({
    invalidated: makeReducer(false, {
      [TREE_LOADED]: () => false,
      [FORM_SUBMIT_SUCCESS + '/chapter_edit']: () => true
    }),
    data: makeReducer({}, {
      [TREE_LOADED]: (state, action) => action.tree
    })
  })
}

export {
  reducer
}