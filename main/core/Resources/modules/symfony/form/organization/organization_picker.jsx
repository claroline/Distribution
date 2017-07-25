import {connect} from 'react-redux'
import React, {Component, PropTypes as T} from 'react'
import moment from 'moment'
import classes from 'classnames'
import ReactDOM from 'react-dom'
import {TreeView} from '#/main/core/layout/treeview/treeview.jsx'
import {select} from './selectors'
import {actions} from './actions'

class OrganizationPicker extends Component {
  constructor(props) {
    super(props)
    this.renderers = {}
  }

  render() {
    return (
      <TreeView
        data={this.props.organizations}
        renderers={this.renderers}
        options={this.props.options}
        onChange={this.props.onChange}
      />
    )
  }
}

OrganizationPicker.propTypes = {
}

function mapStateToProps(state) {
  return {
    organizations: select.organizations(state),
    options: select.options(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: (organization) => dispatch(actions.onChange(organization))
  }
}

const ConnectedOrganizationPicker = connect(mapStateToProps, mapDispatchToProps)(OrganizationPicker)

export {ConnectedOrganizationPicker as OrganizationPicker}
