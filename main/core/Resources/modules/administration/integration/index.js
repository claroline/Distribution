import {bootstrap} from '#/main/app/dom/bootstrap'

import {IntegrationTool} from '#/main/core/administration/integration/components/tool'
import {reducer} from '#/main/core/administration/integration/store/reducer'


// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.integration-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  IntegrationTool,

  // app store configuration
  reducer,
  // initial data
  () => ({
  })
)
