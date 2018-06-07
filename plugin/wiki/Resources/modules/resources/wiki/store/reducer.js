import {makeReducer} from '#/main/core/scaffolding/reducer'

// import {FORM_SUBMIT_SUCCESS} from '#/main/core/data/form/actions'

// app reducers
import {reducer as editorReducer} from '#/plugin/wiki/resources/wiki/editor/reducer'

const reducer = {
  wiki: makeReducer({}, {}),
  wikiForm: editorReducer,
  sectionTree: makeReducer({}, {})
}

export {
  reducer
}