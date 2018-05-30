import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makeResourceReducer} from '#/main/core/resource/reducer'

const reducer = makeResourceReducer({}, {
  resourceNode: makeReducer({}, {}),
  lesson: makeReducer({}, {}),
  currentChapter: makeReducer({}, {})
})

export {
  reducer
}