import {bootstrap} from '#/main/app/bootstrap'

import {reducer} from '#/plugin/scorm/resources/scorm/reducer'
import {ScormResource} from '#/plugin/scorm/resources/scorm/components/resource.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.scorm-container',

  // app main component
  ScormResource,

  // app store configuration
  reducer
)
