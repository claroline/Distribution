import {connect} from 'react-redux'

import {withRouter} from '#/main/app/router'
import {trans} from '#/main/app/intl/translation'
import {selectors as securitySelectors} from '#/main/app/security/store'
import {selectors as profileSelector} from '#/main/core/user/profile/store/selectors'
import {actions as modalActions} from '#/main/app/overlays/modal/store'
import {MODAL_DATA_LIST} from '#/main/app/modals/list'

import {selectors as toolSelectors} from '#/main/core/tool/store'
import {selectors} from '#/main/core/tools/community/store'
import {actions as userActions} from '#/main/core/tools/community/user/store'
import {actions as groupActions}   from '#/main/core/tools/community/group/store'
import {getModalDefinition} from '#/main/core/tools/community/role/modal'
import {selectors as formSelect} from '#/main/app/content/form/store/selectors'
import {selectors as select} from '#/main/core/user/profile/store/selectors'
import {UserList} from '#/main/core/administration/users/user/components/user-list'
import {GroupList} from '#/main/core/administration/users/group/components/group-list'
import {UsersTool as UsersToolComponent} from '#/main/core/tools/community/components/tool'

const UsersTool = withRouter(connect(
  (state) => {
    return {
      context: toolSelectors.contextType(state),
      originalUser: formSelect.originalData(formSelect.form(state, select.FORM_NAME)),
      currentUser: securitySelectors.currentUser(state),
      workspace: toolSelectors.contextData(state)
    }},
  (dispatch) => ({
    loadUser(publicUrl) {
      dispatch(userActions.open(profileSelector.FORM_NAME, publicUrl))
    },
    registerUsers(workspace) {
      dispatch(modalActions.showModal(MODAL_DATA_LIST, {
        icon: 'fa fa-fw fa-user',
        title: trans('register_users'),
        subtitle: trans('workspace_register_select_users'),
        confirmText: trans('select', {}, 'actions'),
        name: selectors.STORE_NAME + '.users.picker',
        definition: UserList.definition,
        card: UserList.card,
        fetch: {
          url: ['apiv2_user_list_registerable'],
          autoload: true
        },
        handleSelect: (users) => {
          dispatch(modalActions.showModal(MODAL_DATA_LIST, getModalDefinition(
            'fa fa-fw fa-user',
            trans('register_users'),
            workspace,
            (roles) => roles.forEach(role => dispatch(userActions.addUsersToRole(role, users)))
          )))
        }
      }))
    },
    registerGroups(workspace) {
      dispatch(modalActions.showModal(MODAL_DATA_LIST, {
        icon: 'fa fa-fw fa-users',
        title: trans('register_groups'),
        subtitle: trans('workspace_register_select_groups'),
        confirmText: trans('select', {}, 'actions'),
        name: selectors.STORE_NAME + '.groups.picker',
        definition: GroupList.definition,
        card: GroupList.card,
        fetch: {
          url: ['apiv2_group_list_registerable'],
          autoload: true
        },
        handleSelect: (groups) => {
          dispatch(modalActions.showModal(MODAL_DATA_LIST, getModalDefinition(
            'fa fa-fw fa-users',
            trans('register_groups'),
            workspace,
            (roles) => roles.forEach(role => dispatch(groupActions.addGroupsToRole(role, groups)))
          )))
        }
      }))
    }
  })
)(UsersToolComponent))

export {
  UsersTool
}
