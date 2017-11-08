import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'
import {Route, Switch} from '#/main/core/router'

import {actions} from '#/main/core/administration/user/group/actions'
import {Group,  GroupActions}  from '#/main/core/administration/user/group/components/group.jsx'
import {Groups, GroupsActions} from '#/main/core/administration/user/group/components/groups.jsx'

const GroupTabActions = props =>
  <Switch>
    <Route path="/groups" exact={true} component={GroupsActions} />
    <Route path="/groups/add" exact={true} component={GroupActions} />
    <Route path="/groups/:id" component={GroupActions} />
  </Switch>

const GroupTab = props =>
  <Switch>
    <Route
      path="/groups"
      exact={true}
      component={Groups}
    />

    <Route
      path="/groups/add"
      exact={true}
      component={Group}
      onEnter={() => props.openForm(null)}
    />

    <Route
      path="/groups/:id"
      component={Group}
      onEnter={(params) => props.openForm(params.id)}
    />
  </Switch>

GroupTab.propTypes = {
  openForm: T.func.isRequired
}

const ConnectedGroupTab = connect(
  null,
  dispatch => ({
    openForm: (id = null) => dispatch(actions.open(id))
  })
)(GroupTab)

export {
  GroupTabActions,
  ConnectedGroupTab as GroupTab
}
