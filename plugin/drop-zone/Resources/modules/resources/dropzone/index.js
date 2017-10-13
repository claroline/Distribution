import {bootstrap} from '#/main/core/utilities/app/bootstrap'

import {reducer} from './reducer'
import {DropzoneResource} from './components/resource.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.dropzone-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  DropzoneResource,

  // app store configuration
  reducer
)
