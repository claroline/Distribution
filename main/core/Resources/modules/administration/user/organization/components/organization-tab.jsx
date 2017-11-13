import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {Routes} from '#/main/core/router'

import {Organization, OrganizationActions}  from '#/main/core/administration/user/organization/components/organization.jsx'
import {Organizations, OrganizationsActions} from '#/main/core/administration/user/organization/components/organizations.jsx'

import {select} from '#/main/core/administration/user/organization/selectors'

const OrganizationTabActions = props =>
  <Routes
    routes={[
      {
        path: '/organizations',
        exact: true,
        component: OrganizationsActions
      }, {
        path: '/organizations/add',
        exact: true,
        component: OrganizationActions
      }, {
        path: '/organizations/:id',
        component: OrganizationActions
      }
    ]}
  />

const OrganizationTab = props =>
  <Routes
    routes={[
      {
        path: '/organizations',
        exact: true,
        component: Organizations
      }, {
        path: '/organizations/add',
        exact: true,
        onEnter: () => props.openForm(null),
        component: Organization
      }, {
        path: '/organizations/:id',
        onEnter: (params) => props.openForm(params.id),
        component: Organization
      }
    ]}
  />

OrganizationTab.propTypes = {
  openForm: T.func.isRequired
}

function mapDispatchToProps(dispatch) {
  return {
    openForm() {

    }
  }
}

const ConnectedOrganizationTab = connect(null, mapDispatchToProps)(OrganizationTab)

export {
  OrganizationTabActions,
  ConnectedOrganizationTab as OrganizationTab
}
