import {combineReducers} from '#/main/core/scaffolding/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'

const reducer = combineReducers({
  flaggedMessages: makeListReducer('moderation.flaggedMessages', {}),
  flaggedSubjects: makeListReducer('moderation.flaggedSubjects', {})
})


export {
  reducer
}
