import {registerModals} from '#/main/core/layout/modal'

// user modals
import {MODAL_ADD_ROLES_GROUPS, AddRolesGroupsModal} from '#/main/core/workspace/user/modals/components/add-roles-groups.jsx'
import {MODAL_REGISTER_USER_WORKSPACE, RegisterUserWorkspaceModal} from '#/main/core/workspace/user/modals/components/register-user-workspace.jsx'

// register user modals
registerModals([
  [MODAL_ADD_ROLES_GROUPS, AddRolesGroupsModal],
  [MODAL_REGISTER_USER_WORKSPACE, RegisterUserWorkspaceModal]
])

export {
  MODAL_ADD_ROLES_GROUPS,
  MODAL_REGISTER_USER_WORKSPACE
}
