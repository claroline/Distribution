import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t, trans} from '#/main/core/translation'
import {navigate, matchPath, Routes, withRouter} from '#/main/core/router'

import {PageActions} from '#/main/core/layout/page/components/page-actions.jsx'
import {PageAction} from '#/main/core/layout/page'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'

import {Group}    from '#/main/core/administration/user/group/components/group.jsx'
import {Groups}   from '#/main/core/workspace/user/group/components/group-list.jsx'
import {actions} from '#/main/core/workspace/user/group/actions'
import {select}  from '#/main/core/workspace/user/selectors'

import {MODAL_ADD_ROLES_GROUPS} from '#/main/core/workspace/user/modals/components/add-roles-groups.jsx'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {ADMIN, getPermissionLevel} from  '#/main/core/workspace/user/restrictions'
import {currentUser} from '#/main/core/user/current'

const GroupTabActionsComponent = props =>
  <PageActions>
    {getPermissionLevel(currentUser(), props.workspace) === ADMIN &&
      <FormPageActionsContainer
        formName="groups.current"
        target={(user, isNew) => isNew ?
          ['apiv2_group_create'] :
          ['apiv2_group_update', {id: user.id}]
        }
        opened={!!matchPath(props.location.pathname, {path: '/groups/form'})}
        open={{
          icon: 'fa fa-plus',
          label: t('add_group'),
          action: '#/groups/form'
        }}
        cancel={{
          action: () => navigate('/groups')
        }}
      />
    }
    <PageAction
      id='add-role'
      title={trans('add_role')}
      icon={'fa fa-id-badge'}
      disabled={false}
      action={() => props.register(props.workspace)}
      primary={false}
    />
  </PageActions>

GroupTabActionsComponent.propTypes = {
  location: T.object,
  workspace: T.object,
  register: T.func
}

const ConnectedActions = connect(
  state => ({
    workspace: select.workspace(state)
  }),
  dispatch => ({
    register(workspace) {
      dispatch(
        modalActions.showModal(MODAL_ADD_ROLES_GROUPS, {
          title: trans('add_roles'),
          question: trans('add_roles'),
          workspace: workspace,
          handleConfirm: (roles, users) => dispatch(actions.register(roles, users, workspace))
        })
      )
    }
  })
)(GroupTabActionsComponent)

const GroupTabActions = withRouter(ConnectedActions)

const GroupTabComponent = props =>
  <Routes
    routes={[
      {
        path: '/groups',
        exact: true,
        component: Groups
      }, {
        path: '/groups/form/:id?',
        component: Group,
        onEnter: (params) => props.openForm(params.id || null, props.workspace, props.restrictions, props.collaboratorRole)
      }
    ]}
  />

GroupTabComponent.propTypes = {
  openForm: T.func.isRequired,
  workspace: T.object,
  restrictions: T.object,
  collaboratorRole: T.object
}

const GroupTab = connect(
  state => ({
    workspace: select.workspace(state),
    restrictions: select.restrictions(state),
    collaboratorRole: select.collaboratorRole(state)
  }),
  dispatch => ({
    openForm(id = null, workspace, restrictions, collaboratorRole) {

      const defaultValue = {
        organization: null, //retreive it with axel stuff
        roles: [collaboratorRole]
      }

      dispatch(actions.open('groups.current', id, defaultValue))
    }
  })
)(GroupTabComponent)

export {
  GroupTabActions,
  GroupTab
}
