import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'
import {navigate, matchPath, Routes, withRouter} from '#/main/core/router'

import {PageActions} from '#/main/core/layout/page/components/page-actions.jsx'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'

import {Group}   from '#/main/core/administration/user/group/components/group.jsx'
import {Groups}  from '#/main/core/administration/user/group/components/groups.jsx'
import {actions} from '#/main/core/administration/user/group/actions'

const RoleTabActionsComponent = props =>
  <PageActions>
    <FormPageActionsContainer
      formName="groups.current"
      target={(group, isNew) => isNew ?
        ['apiv2_group_create'] :
        ['apiv2_group_update', {id: group.id}]
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
  </PageActions>

RoleTabActionsComponent.propTypes = {
  location: T.shape({
    pathname: T.string
  }).isRequired
}

const RoleTabActions = withRouter(RoleTabActionsComponent)

const RoleTabComponent = props =>
  <Routes
    routes={[
      {
        path: '/groups',
        exact: true,
        component: Groups
      }, {
        path: '/groups/form/:id?',
        onEnter: (params) => props.openForm(params.id || null),
        component: Group
      }
    ]}
  />

RoleTabComponent.propTypes = {
  openForm: T.func.isRequired
}

const RoleTab = connect(
  null,
  dispatch => ({
    openForm(id = null) {
      dispatch(actions.open('groups.current', id))
    }
  })
)(RoleTabComponent)

export {
  RoleTabActions,
  RoleTab
}
