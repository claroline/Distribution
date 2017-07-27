import {connect} from 'react-redux'
import React, {Component, PropTypes as T} from 'react'
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
  data: T.arrayOf(T.object).isRequired,
  options: T.shape({
    name: T.string, //checkbox base name
    selected: T.array,
    selectable: T.bool, //allow checkbox selection
    collapse: T.bool, //collapse the datatree
    autoSelect: T.bool, //automatically select children
    cssProperties: {
      open: T.string, //default css for open node
      close: T.string //default css for closed node
    }
  }),
  onChange: T.func
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
