import merge from 'lodash/merge'

import {bootstrap} from '#/main/core/utilities/app/bootstrap'
import {generateUrl} from '#/main/core/fos-js-router'

import {t, transChoice} from '#/main/core/translation'

// modals
import {registerModalType} from '#/main/core/layout/modal'
//import {UserPickerModal} from '#/main/core/layout/modal/components/user-picker.jsx'
import {FormModal} from '#/main/core/layout/modal/components/form.jsx'

// reducers
import {reducer as apiReducer} from '#/main/core/api/reducer'
import {reducer as modalReducer} from '#/main/core/layout/modal/reducer'

import {reducer as usersReducer} from '#/main/core/administration/user/user/reducer'
import {reducer as parametersReducer} from '#/main/core/administration/user/parameters/reducer'
import {reducer as groupsReducer} from '#/main/core/administration/user/group/reducer'
import {reducer as rolesReducer} from '#/main/core/administration/user/role/reducer'
import {reducer as profileReducer} from '#/main/core/administration/user/profile/reducer'
import {reducer as organizationReducer} from '#/main/core/administration/user/organization/reducer'
import {reducer as locationsReducer} from '#/main/core/administration/user/locations/reducer'

import {UserMain} from '#/main/core/administration/user/components/main.jsx'

// register custom modals for the app
registerModalType('MODAL_FORM', FormModal)

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.users-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  UserMain,

  // app store configuration
  {
    // app reducers
    users: usersReducer,
    groups: groupsReducer,
    roles: rolesReducer,
    locations: locationsReducer,
    profile: profileReducer,
    organizations: organizationReducer,
    parameters: parametersReducer,
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
      groups: merge({}, initialData.groups, {
        fetchUrl: generateUrl('apiv2_group_list')
      }),
      roles: merge({}, initialData.roles, {
        fetchUrl: generateUrl('apiv2_role_list')
      }),
      locations: merge({}, initialData.locations, {
        fetchUrl: generateUrl('apiv2_location_list'),
        delete: {
          title: (locations) => transChoice('remove_locations', locations.length, {count: locations.length}, 'platform'),
          question: (locations) => t('remove_locations_confirm', {
            location_list: locations.map(locations => workspace.name).join(', ')
          })
        }
      }),
      organizations: merge({}, initialData.organizations),
      parameters: merge({}, {data: initialData.parameters}, {platformRoles: initialData.platformroles}, {locales: initialData.locales})
    }
  }
)
