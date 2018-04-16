import {makePageReducer} from '#/main/core/layout/page/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'

const reducer = makePageReducer({}, {
  parameters: makeFormReducer('parameters'),
  resourcesPicker: makeListReducer('resourcesPicker')
})

export {
  reducer
}
