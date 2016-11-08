import {makeReducer} from './../../utils/reducers'

import {
  CATEGORY_UPDATE
} from './../actions/categories'

function updateCategory(categoriesState, action = {}) {

}

const categoriesReducer = makeReducer([], {
  [CATEGORY_UPDATE]: updateCategory
})

export default categoriesReducer
