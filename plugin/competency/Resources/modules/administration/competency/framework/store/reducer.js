import {makeReducer, combineReducers} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'
import {makeFormReducer} from '#/main/app/content/form/store/reducer'
import {FORM_SUBMIT_SUCCESS} from '#/main/app/content/form/store/actions'

const reducer = combineReducers({
  list: makeListReducer('frameworks.list', {
    sortBy: {property: 'name', direction: 1}
  }, {
    invalidated: makeReducer(false, {
      [FORM_SUBMIT_SUCCESS+'/frameworks.form']: () => true
    })
  }),
  form: makeFormReducer('frameworks.form', {}, {}),
  current: makeFormReducer('frameworks.current', {}, {})
})

export {
  reducer
}