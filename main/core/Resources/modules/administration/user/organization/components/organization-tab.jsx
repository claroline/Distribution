import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {TreeView} from '#/main/core/layout/treeview/treeview.jsx'
import {select} from '#/main/core/administration/user/organization/selectors'

const OrganizationTabActions = props =>
  <div>
    page actions
  </div>

const OrganizationTab = props =>
  <TreeView
    data={props.organizations.data}
    options={{
      name: 'select-orga',
      selected: [],
      selectable: true,
      collapse: true
    }}
    onChange={() => { }}
  />


OrganizationTab.propTypes = {
  organizations: T.shape({
    data: T.array.isRequired
  }).isRequired
}

function mapStateToProps(state) {
  return {
    organizations: select.organizations(state)
  }
}

const ConnectedOrganizationTab = connect(mapStateToProps)(OrganizationTab)

export {
  OrganizationTabActions,
  ConnectedOrganizationTab as OrganizationTab
}
