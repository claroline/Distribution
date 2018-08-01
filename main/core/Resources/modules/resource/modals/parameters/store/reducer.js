import {makeFormReducer} from '#/main/app/content/form/store/reducer'

import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'
import {selectors} from '#/main/core/resource/modals/parameters/store/selectors'

const reducer = makeFormReducer(selectors.STORE_NAME, {
  data: ResourceNodeTypes.defaultProps
})

export {
  reducer
}
