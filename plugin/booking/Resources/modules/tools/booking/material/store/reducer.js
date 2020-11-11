import {makeReducer, combineReducers} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store/reducer'
import {makeFormReducer, FORM_SUBMIT_SUCCESS} from '#/main/app/content/form/store'

import {selectors} from '#/plugin/booking/tools/booking/material/store/selectors'

const reducer = combineReducers({
  list: makeListReducer(selectors.LIST_NAME, {
    sortBy: {property: 'name', direction: 1}
  }, {
    invalidated: makeReducer(false, {
      [FORM_SUBMIT_SUCCESS+'/'+selectors.FORM_NAME]: () => true
    })
  }),
  current: makeFormReducer(selectors.FORM_NAME)
})

export {
  reducer
}