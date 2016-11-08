import React, { Component } from 'react'
import { DropdownButton, MenuItem } from 'react-bootstrap'

const T = React.PropTypes

const PagePrimaryAction = props =>
  <button
    type="button"
    className="btn btn-link"
    onClick={props.handleAction}
  >
    {props.icon && <span className={props.icon}></span>}
    &nbsp;{props.label}
  </button>

PagePrimaryAction.propTypes = {
  icon: T.string,
  label: T.string.isRequired,
  handleAction: T.func.isRequired
}

const MoreActionsDropdown = props =>
  <DropdownButton
    id={`dropdown-other-actions`}
    title={<span className="fa fa-fw fa-ellipsis-v"></span>}
    bsStyle={`link`}
    noCaret={true}
    pullRight={true}
  >
    <MenuItem header>More actions</MenuItem>
    {props.actions.map((action, index) => (
      <MenuItem key={index} eventKey={index}>
        {action.icon && <span className={action.icon}></span>}
        &nbsp;{action.label}
      </MenuItem>
    ))}
  </DropdownButton>

MoreActionsDropdown.propTypes = {
  actions: T.arrayOf(
    T.shape({
      icon: T.string,
      label: T.string.isRequired,
      primary: T.bool,
      handleAction: T.func.isRequired
    })
  ).isRequired
}

export default class PageActions extends Component {
  render() {
    const primaryActions = this.props.actions.filter(action => action.primary)
    const secondaryActions = this.props.actions.filter(action => !action.primary)

    return (
      <div className="page-actions">
        {primaryActions.map((primaryAction, index) => (
          <PagePrimaryAction key={index} icon={primaryAction.icon} label={primaryAction.label} handleAction={primaryAction.handleAction} />
        ))}

        {0 !== secondaryActions.length && <MoreActionsDropdown actions={secondaryActions} />}
      </div>
    )
  }
}

PageActions.propTypes = {
  actions: T.arrayOf(
    T.shape({
      icon: T.string,
      label: T.string.isRequired,
      primary: T.bool,
      handleAction: T.func.isRequired
    })
  ).isRequired
}
