import {bootstrap} from '#/main/core/utilities/app/bootstrap'
import {generateUrl} from '#/main/core/fos-js-router'
import {t, transChoice} from '#/main/core/translation'

// reducers
import {reducer as apiReducer} from '#/main/core/api/reducer'
import {reducer as modalReducer} from '#/main/core/layout/modal/reducer'

import {reducer as parametersReducer} from '#/main/core/administration/user/parameters/reducer'
import {reducer as usersReducer} from '#/main/core/administration/user/user/reducer'
import {reducer as groupsReducer} from '#/main/core/administration/user/group/reducer'
import {reducer as rolesReducer} from '#/main/core/administration/user/role/reducer'
import {reducer as profileReducer} from '#/main/core/administration/user/profile/reducer'
import {reducer as organizationReducer} from '#/main/core/administration/user/organization/reducer'
import {reducer as locationReducer} from '#/main/core/administration/user/location/reducer'

import {UserTool} from '#/main/core/administration/user/components/tool.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.users-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  UserTool,

  // app store configuration
  {
    // app reducers
    parameters: parametersReducer,
    users: usersReducer,
    groups: groupsReducer,
    roles: rolesReducer,
    locations: locationReducer,
    profile: profileReducer,
    organizations: organizationReducer,
    // generic reducers
    currentRequests: apiReducer,
    modal: modalReducer
  },

  // remap data-attributes set on the app DOM container
  (initialData) => {
    return {
      /*users: {
        list: initialData.users
      },
      groups: {
        list: initialData.groups
      },
      roles: {
        list: initialData.roles
      },
      locations: {
        list: initialData.locations
      },
      organizations: {
        list: initialData.organizations
      },*/
      parameters: {
        data: initialData.parameters
      }
    }
  }
)
