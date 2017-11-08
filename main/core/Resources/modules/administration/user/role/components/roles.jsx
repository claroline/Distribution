import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'
import {RoleList} from '#/main/core/administration/user/role/components/role-list.jsx'

const RolesActions = props =>
  <PageActions>
    <PageAction
      id="role-add"
      icon="fa fa-plus"
      title={t('add_role')}
      action="#/roles/add"
      primary={true}
    />
  </PageActions>

const Roles = props =>
  <DataList
    name="roles.list"
    actions={[]}
    definition={RoleList.definition}
    card={RoleList.card}
  />

Roles.propTypes = {

}

function mapStateToProps(state) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

const ConnectedRoles = connect(mapStateToProps, mapDispatchToProps)(Roles)

export {
  RolesActions,
  ConnectedRoles as Roles
}
