import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {Route, Switch} from '#/main/core/router'
import {User,  UserActions}  from '#/main/core/administration/user/user/components/user.jsx'
import {Users, UsersActions} from '#/main/core/administration/user/user/components/users.jsx'

const UserTabActions = props =>
  <Switch>
    <Route path="/users" exact={true} component={UsersActions} />
    <Route path="/users/add" exact={true} component={UserActions} />
    <Route path="/users/:id" component={UserActions} />
  </Switch>

const UserTab = props =>
  <Switch>
    <Route
      path="/users"
      exact={true}
      component={Users}
    />

    <Route
      path="/users/add"
      exact={true}
      component={User}
      onEnter={() => props.openForm(null)}
    />

    <Route
      path="/users/:id"
      component={User}
      onEnter={(params) => props.openForm(params.uuid)}
    />
  </Switch>

User.propTypes = {
  openForm: T.func.isRequired
}

function mapDispatchToProps(dispatch) {
  return {
    openForm(id = null) {
      dispatch(actions.open(id))
    }
  }
}

const ConnectedUserTab = connect(null, mapDispatchToProps)(UserTab)

export {
  UserTabActions,
  ConnectedUserTab as UserTab
}
