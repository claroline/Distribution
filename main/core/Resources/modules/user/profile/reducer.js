import {makeReducer} from '#/main/core/utilities/redux/reducer'
import {makePageReducer} from '#/main/core/layout/page/reducer'

import {
  PROFILE_FACET_OPEN
} from '#/main/core/user/profile/actions'

const reducer = makePageReducer({}, {
  currentFacet: makeReducer(null, {
    [PROFILE_FACET_OPEN]: (state, action) => action.id
  }),
  facets: makeReducer([], {}),
  user: makeReducer({}, {

  })
})

export {
  reducer
}
