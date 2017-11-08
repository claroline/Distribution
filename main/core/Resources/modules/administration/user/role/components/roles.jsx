import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

import {enumRole} from '#/main/core/enum/role'

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
    definition={[
      {name: 'name', type: 'string', label: t('name'), displayed: true},
      {name: 'type', type: 'enum', label: t('type'), options: {choices: enumRole}, displayed: false},
      {name: 'translationKey', type: 'string', label: t('translation'), renderer: (rowData) => t(rowData.translationKey), displayed: true}
    ]}
    actions={[]}
    card={(row) => ({
      onClick: '#',
      poster: null,
      icon: 'fa fa-users',
      title: row.name,
      subtitle: row.name,
      contentText: '',
      flags: [],
      footer: <span>footer</span>,
      footerLong: <span>footerLong</span>
    })}
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
