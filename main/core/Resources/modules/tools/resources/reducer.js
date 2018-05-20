import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'

export const reducer = {
  root: makeReducer(null, {

  }),
  current: makeReducer(null, {

  }),
  resources: makeListReducer('resources')
}
