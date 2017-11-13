import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {Routes} from '#/main/core/router'

import {actions} from '#/main/core/administration/user/group/actions'
import {Group,  GroupActions}  from '#/main/core/administration/user/group/components/group.jsx'
import {Groups, GroupsActions} from '#/main/core/administration/user/group/components/groups.jsx'

const GroupTabActions = () =>
  <Routes
    routes={[
      {
        path: '/groups',
        exact: true,
        component: GroupsActions
      }, {
        path: '/groups/add',
        exact: true,
        component: GroupActions
      }, {
        path: '/groups/:id',
        component: GroupActions
      }
    ]}
  />

const GroupTab = props =>
  <Routes
    routes={[
      {
        path: '/groups',
        exact: true,
        component: Groups
      }, {
        path: '/groups/add',
        exact: true,
        onEnter: () => props.openForm('groups.current'),
        component: Group
      }, {
        path: '/groups/:id',
        onEnter: (params) => props.openForm('groups.current', params.id),
        component: Group
      }
    ]}
  />

GroupTab.propTypes = {
  openForm: T.func.isRequired
}

const ConnectedGroupTab = connect(
  null,
  dispatch => ({
    openForm: (formName, id = null) => dispatch(actions.open(formName, id))
  })
)(GroupTab)

export {
  GroupTabActions,
  ConnectedGroupTab as GroupTab
}
