import merge from 'lodash/merge'

import {bootstrap} from '#/main/core/utilities/app/bootstrap'
import {generateUrl} from '#/main/core/fos-js-router'

// modals
import {registerModalType} from '#/main/core/layout/modal'
import {ConfirmModal} from '#/main/core/layout/modal/components/confirm.jsx'
import {UserPickerModal} from '#/main/core/layout/modal/components/user-picker.jsx'
import {FormModal} from '#/main/core/layout/modal/components/form.jsx'

// reducers
import {reducer as apiReducer} from '#/main/core/api/reducer'
import {reducer as modalReducer} from '#/main/core/layout/modal/reducer'
import {makeListReducer} from '#/main/core/layout/list/reducer'

import {reducer as usersReducer} from '#/main/core/administration/user-management/user/reducer'
//import {reducer as groupsReducer} from '#/main/core/administration/user-management/group/reducer'
//import {reducer as rolesReducer} from '#/main/core/administration/user-management/role/reducer'

import {Users} from '#/main/core/administration/user-management/user/components/users.jsx'
//import {Groups} from '#/main/core/administration/user-management/group/components/groups.jsx'
//import {Roles} from '#/main/core/administration/user-management/role/components/roles.jsx'

// register custom modals for the app
registerModalType('CONFIRM_MODAL', ConfirmModal)
registerModalType('MODAL_FORM', FormModal)

// mount the react application
bootstrap(
  // app DOM container (also holds initial app data as data attributes)
  '.user-administration-container',

  // app main component (accepts either a `routedApp` or a `ReactComponent`)
  Users,

  // app store configuration
  {
    // app reducers
    users: usersReducer,
    //groups: groupsReducer,
    //roles: rolesReducer,
    // generic reducers
    currentRequests: apiReducer,
    modal: modalReducer
  },

  // remap data-attributes set on the app DOM container
  (initialData) => {
    return {
      users: merge({}, initialData.users, {
        fetchUrl: generateUrl('apiv2_user_list')
      })
    }
  }
)
