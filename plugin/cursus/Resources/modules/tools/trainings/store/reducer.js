import {combineReducers} from '#/main/app/store/reducer'

import {reducer as catalogReducer} from '#/plugin/cursus/tools/trainings/catalog/store/reducer'

const reducer = combineReducers({
  catalog: catalogReducer
})

export {
  reducer
}