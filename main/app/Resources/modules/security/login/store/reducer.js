import {makeReducer} from '#/main/app/store/reducer'
import {makeFormReducer} from '#/main/app/content/form/store/reducer'

export const reducer = {
  sso: makeReducer([]),
  form: makeFormReducer('login.form')
}
