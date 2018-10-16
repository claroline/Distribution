// import {makeFormReducer} from '#/main/app/content/form/store/reducer'
import {makeReducer, combineReducers} from '#/main/app/store/reducer'

const reducer = {
  tools: makeReducer()
}

export {
  reducer
}