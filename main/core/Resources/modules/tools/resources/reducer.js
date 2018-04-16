import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makeToolReducer} from '#/main/core/tool/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'

export const reducer = makeToolReducer({}, {
  root: makeReducer(null, {

  }),
  current: makeReducer(null, {

  }),
  resources: makeListReducer('resources')
})
