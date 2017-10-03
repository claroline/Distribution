import {bootstrap} from '#/main/core/utilities/app/bootstrap'

// reducers
import {reducer as apiReducer} from '#/main/core/api/reducer'
import {reducer as modalReducer} from '#/main/core/layout/modal/reducer'
import {reducer as resourceReducer} from '#/main/core/layout/resource/reducer'

import {AnnouncementResource} from './components/resource.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.announcement-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  AnnouncementResource,

  // app store configuration
  {
    // there is no editor for now, so we just init a static store
    announce: (state = {}) => state,

    // generic reducers
    currentRequests: apiReducer,
    modal: modalReducer,
    resourceNode: resourceReducer
  }
)
