import merge from 'lodash/merge'

import {bootstrap} from '#/main/core/utilities/app/bootstrap'
import {generateUrl} from '#/main/core/fos-js-router'

// reducers
import {reducer as apiReducer} from '#/main/core/api/reducer'
import {reducer as modalReducer} from '#/main/core/layout/modal/reducer'

import {reducer as parametersReducer} from '#/main/core/administration/user/parameters/reducer'
import {reducer as usersReducer} from '#/main/core/administration/user/user/reducer'
import {reducer as groupsReducer} from '#/main/core/administration/user/group/reducer'
import {reducer as rolesReducer} from '#/main/core/administration/user/role/reducer'
import {reducer as profileReducer} from '#/main/core/administration/user/profile/reducer'

import {UserMain} from '#/main/core/administration/user/components/main.jsx'

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.users-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  UserMain,

  // app store configuration
  {
    // app reducers
    parameters: parametersReducer,
    users: usersReducer,
    groups: groupsReducer,
    roles: rolesReducer,
    profile: profileReducer,

    // generic reducers
    currentRequests: apiReducer,
    modal: modalReducer
  },

  // remap data-attributes set on the app DOM container
  (initialData) => {
    return {
      users: merge({}, initialData.users, {
        fetchUrl: generateUrl('apiv2_user_list')
      }),
      groups: {
        list: merge({}, initialData.groups, {
          fetchUrl: generateUrl('apiv2_group_list')
        })
      },
      roles: merge({}, initialData.roles, {
        fetchUrl: generateUrl('apiv2_role_list')
      })
    }
  }
)
