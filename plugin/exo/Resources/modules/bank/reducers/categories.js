import {makeReducer} from './../../utils/reducers'

import {
  CATEGORY_UPDATE
} from './../actions/categories'

function updateCategory() {

}

const categoriesReducer = makeReducer([], {
  [CATEGORY_UPDATE]: updateCategory
})

export default categoriesReducer
