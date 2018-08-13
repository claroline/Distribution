import {ResourceMain} from '#/main/core/resource/containers/main'
import {reducer, selectors} from '#/main/core/resource/store'

export const App = () => ({
  component: ResourceMain,
  store: {
    [selectors.STORE_NAME]: reducer
  },
  initialData: (initialData) => Object.assign({}, {
    [selectors.STORE_NAME]: {
      node: initialData.resourceNode,
      evaluation: initialData.evaluation
    }
  })
})
