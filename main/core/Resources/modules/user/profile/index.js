import {bootstrap} from '#/main/core/utilities/app/bootstrap'

import {reducer} from '#/main/core/user/profile/reducer'
import {Profile} from '#/main/core/user/profile/components/main.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.user-profile-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  Profile,

  // app store configuration
  reducer,

  (initialData) => Object.assign({}, initialData, {
    user: {
      data: initialData.user,
      originalData: initialData.user
    },
    facets: initialData.facets
  })
)
