
import {LayoutMain} from '#/main/app/layout/containers/main'
import {reducer} from '#/main/app/layout/store'

export default {
  component: LayoutMain,
  store: reducer,
  initialData: (initialData) => ({
    maintenance: initialData.maintenance,
    header: initialData.header,
    parameters: initialData.parameters,
    security: {
      impersonated: initialData.impersonated,
      currentUser: initialData.currentUser
    }
  })
}
