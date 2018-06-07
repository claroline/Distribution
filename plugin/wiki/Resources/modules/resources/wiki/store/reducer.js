import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'
import {FORM_SUBMIT_SUCCESS} from '#/main/core/data/form/actions'

// app reducers
import {reducer as editorReducer} from '#/plugin/wiki/resources/wiki/editor/store'
import {
  UPDATE_CURRENT_SECTION,
  UPDATE_ACTIVE_CONTRIBUTION,
  UPDATE_CURRENT_VERSION,
  UPDATE_COMPARE_VERSION_SET
} from '#/plugin/wiki/resources/wiki/store/actions'
import {updateInTree} from '#/plugin/wiki/resources/wiki/utils'

const wikiReducer = makeReducer({}, {
  [FORM_SUBMIT_SUCCESS+'/wikiForm']: (state, action) => action.updatedData
})

const sectionTreeReducer = makeReducer({}, {
  [UPDATE_ACTIVE_CONTRIBUTION]: (state, action) => {
    return updateInTree(state, action.sectionId, 'activeContribution', action.contribution)
  }
})

const reducer = {
  wiki: wikiReducer,
  wikiForm: editorReducer,
  sectionTree: sectionTreeReducer,
  sectionHistory: makeListReducer('sectionHistory'),
  currentSection: makeReducer({}, {
    [UPDATE_CURRENT_SECTION]: (state, action) => action.section,
    [UPDATE_ACTIVE_CONTRIBUTION]: (state, action) => {
      return Object.assign({}, state, {activeContribution: action.contribution})
    }
  }),
  currentVersion: makeReducer({}, {
    [UPDATE_CURRENT_VERSION]: (state, action) => action.contribution
  }),
  compareSet: makeReducer([], {
    [UPDATE_COMPARE_VERSION_SET]: (state, action) => action.contributions
  })
}

export {
  reducer
}