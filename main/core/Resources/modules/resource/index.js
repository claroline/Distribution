
import {ResourceMain} from '#/main/core/resource/containers/main'
import {reducer, selectors} from '#/main/core/resource/store'

export const App = () => ({
  component: ResourceMain,
  store: reducer
})
