import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {actions} from '#/main/core/administration/user/role/actions'
import {select} from '#/main/core/administration/user/role/selectors'

import {enumRole} from '#/main/core/enum/role'

import {PageSection} from '#/main/core/layout/page/components/page-section.jsx'
import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

const Roles = props =>
  <PageSection
    path="/roles"
    icon="fa fa-id-badge"
    title={t('roles')}
    actions={[
      {
        icon: 'fa fa-plus',
        label: t('add_role'),
        action: '/roles/add',
        primary: true
      }, {
        icon: 'fa fa-download',
        label: t('import_roles'),
        action: '/roles/import'
      }
    ]}
  >
    <DataList
      name="roles"
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
  </PageSection>

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
  ConnectedRoles as RoleSection
}
