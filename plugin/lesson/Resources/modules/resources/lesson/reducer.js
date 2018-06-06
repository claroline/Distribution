import {makeReducer} from '#/main/core/scaffolding/reducer'

const reducer = makeReducer({}, {
  resourceNode: makeReducer({}, {}),
  lesson: makeReducer({}, {}),
  currentChapter: makeReducer({}, {})
})

export {
  reducer
}