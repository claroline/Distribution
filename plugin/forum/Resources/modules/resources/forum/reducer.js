
import {makeReducer} from '#/main/app/store/reducer'


import {reducer as editorReducer} from '#/plugin/forum/resources/forum/editor/reducer'
import {reducer as playerReducer} from '#/plugin/forum/resources/forum/player/reducer'
import {reducer as moderationReducer} from '#/plugin/forum/resources/forum/moderation/reducer'
import {reducer as overviewReducer} from '#/plugin/forum/resources/forum/overview/reducer'

import {FORM_SUBMIT_SUCCESS} from '#/main/core/data/form/actions'

const reducer = {
  forum: makeReducer({}, {
    [FORM_SUBMIT_SUCCESS+'/forumForm']: (state, action) => action.updatedData
  }),
  lastMessages: overviewReducer,
  moderation: moderationReducer,
  forumForm: editorReducer,
  subjects: playerReducer
}

export {
  reducer
}
