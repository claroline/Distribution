
import {makePageReducer} from '#/main/core/layout/page/reducer'
import {makeFormReducer} from '#/main/core/layout/form/reducer'

export const reducer = makePageReducer({}, {
  termOfService: (state = null) => state,
  options: (state = {}) => state,
  user: makeFormReducer('user', {
    new: true
  })
})
