import {bootstrap} from '#/main/core/utilities/app/bootstrap'

// reducers
import {reducer as apiReducer} from '#/main/core/api/reducer'
import {reducer as modalReducer} from '#/main/core/layout/modal/reducer'
import {t, transChoice} from '#/main/core/translation'

import {Import} from '#/main/core/administration/import/components/import.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.import-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  Import,

  // app store configuration
  {
    // app reducers

    // generic reducers
    currentRequests: apiReducer,
    modal: modalReducer
  }
)
