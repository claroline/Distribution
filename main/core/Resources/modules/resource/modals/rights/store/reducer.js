import {makeFormReducer} from '#/main/core/data/form/reducer'
import {makeReducer} from '#/main/core/scaffolding/reducer'
import {RESOURCE_UPDATE_RIGHTS} from '#/main/core/resource/modals/rights/store/actions'
import {selectors} from '#/main/core/resource/modals/rights/store/selectors'

//both of them required ?
const reducer = makeFormReducer(selectors.STORE_NAME, {}, {/*
  data: makeReducer([], {
    [RESOURCE_UPDATE_RIGHTS]: (state, action) => {
      return action.permissions
    }
  }),
  originalData: makeReducer([], {
    [RESOURCE_UPDATE_RIGHTS]: (state, action) => {
      return action.permissions
    }
  })*/
})

export {
  reducer
}
