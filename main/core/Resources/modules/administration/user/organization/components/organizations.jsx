import React, {Component} from 'react'
import {TreeView} from '#/main/core/layout/treeview/treeview.jsx'
import {select} from '#/main/core/administration/user/organization/selectors'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

class Organizations extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (<div>
      <TreeView
        data={this.props.organizations.data}
        options={{
          name: 'select-orga',
          selected: [],
          selectable: true,
          collapse: true
        }}
        onChange={() => { }}
      />
  </div>)
  }
}

Organizations.propTypes = {
  organizations: T.shape({
    data: T.array.isRequired
  }).isRequired
}

function mapStateToProps(state) {
  return {
    organizations: select.organizations(state)
  }
}

const ConnectedOrganizations = connect(mapStateToProps)(Organizations)

export {
  ConnectedOrganizations as Organizations
}
