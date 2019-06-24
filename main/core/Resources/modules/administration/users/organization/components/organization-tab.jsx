import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'

import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions'
import {LINK_BUTTON} from '#/main/app/buttons'

import {Organization}  from '#/main/core/administration/users/organization/components/organization'
import {Organizations} from '#/main/core/administration/users/organization/components/organizations'
import {actions}       from '#/main/core/administration/users/organization/actions'
import {select}        from '#/main/core/administration/users/organization/selectors'

const OrganizationTabActions = () =>
  <PageActions>
    <PageAction
      type={LINK_BUTTON}
      icon="fa fa-plus"
      label={trans('add_organization')}
      target="/organizations/form"
      primary={true}
    />
  </PageActions>

const OrganizationTabComponent = props =>
  <Routes
    routes={[
      {
        path: '/organizations',
        exact: true,
        component: Organizations
      }, {
        path: '/organizations/form/:id?',
        onEnter: (params) => props.openForm(params.id),
        exact: true,
        component: Organization
      }, {
        path: '/organizations/form/parent/:parent',
        onEnter: (params) => {
          const parent = props.organizations.find(organization => organization.id === params.parent)
          props.openForm(null, parent)
        },
        component: Organization
      }
    ]}
  />

OrganizationTabComponent.propTypes = {
  openForm: T.func.isRequired,
  organizations: T.array.isRequired
}

const OrganizationTab = connect(
  state => ({
    organizations: select.flattenedOrganizations(state)
  }),
  dispatch => ({
    openForm(id = null, parent = null) {
      const defaultProps = {}
      if (parent) {
        defaultProps.parent = parent
      }
      dispatch(actions.open('organizations.current', id, defaultProps))
    }
  })
)(OrganizationTabComponent)

export {
  OrganizationTabActions,
  OrganizationTab
}
