import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import classes from 'classnames'

import {trans} from '#/main/core/translation'
import {TooltipAction} from '#/main/core/layout/button/components/tooltip-action.jsx'

import {select} from '#/plugin/scorm/resources/scorm/selectors'
import {Sco as ScoType} from '#/plugin/scorm/resources/scorm/prop-types'
import {actions} from '#/plugin/scorm/resources/scorm/player/actions'

const SummaryHeader = props =>
  <header className="summary-header">
    <h3 className="h2 summary-title">
      <span className="fa fa-fw fa-ellipsis-v" />
      {trans('summary')}
    </h3>

    <div className="summary-controls">
      {props.opened &&
        <TooltipAction
          id="path-summary-pin"
          position={props.opened ? 'bottom':'right'}
          className={classes('btn-link summary-control hidden-xs hidden-sm', {
            active: props.pinned
          })}
          icon="fa fa-fw fa-map-pin"
          label={trans(props.pinned ? 'unpin_summary':'pin_summary', {}, 'path')}
          action={props.togglePin}
        />
      }

      <TooltipAction
        id="path-summary-open"
        position={props.opened ? 'bottom':'right'}
        className="btn-link summary-control"
        icon={classes('fa fa-fw', {
          'fa-chevron-left': props.opened,
          'fa-chevron-right': !props.opened
        })}
        label={trans(props.opened ? 'close_summary':'open_summary', {}, 'path')}
        action={props.toggleOpen}
      />
    </div>
  </header>

SummaryHeader.propTypes = {
  opened: T.bool,
  pinned: T.bool,
  togglePin: T.func.isRequired,
  toggleOpen: T.func.isRequired
}

class SummaryLink extends Component {
  constructor(props) {
    super(props)

    this.state = {
      collapsible: props.sco.children && 0 !== props.sco.children.length,
      collapsed: false
    }
  }

  render() {
    return (
      <li className="summary-link-container">
        <div className="summary-link">
          <a
            className="pointer-hand"
            onClick={() => {
              if (this.props.sco.data.entryUrl) {
                this.props.openSco(this.props.sco)
              }
            }}
          >
            {this.props.opened && this.props.sco.data.title}
          </a>

          {(this.props.opened && this.state.collapsible) &&
            <div className="step-actions">
              {this.state.collapsible &&
                <TooltipAction
                  id={`sco-${this.props.sco.id}-collapse`}
                  position="bottom"
                  className="btn-link btn-summary"
                  icon={classes('fa', {
                    'fa-caret-right': this.state.collapsed,
                    'fa-caret-down': !this.state.collapsed
                  })}
                  label={trans(this.state.collapsed ? 'expand' : 'collapse')}
                  action={() => this.setState({collapsed: !this.state.collapsed})}
                />
              }
            </div>
          }
        </div>

        {!this.state.collapsed && this.props.sco.children.length > 0 &&
          <ul className="sco-children">
            {this.props.sco.children.map(child =>
              <SummaryLink
                key={`summary-sco-${child.id}`}
                opened={this.props.opened}
                sco={child}
                openSco={this.props.openSco}
              />
            )}
          </ul>
        }
      </li>
    )
  }
}

SummaryLink.propTypes = {
  opened: T.bool.isRequired,
  sco: T.shape(ScoType.propTypes).isRequired,
  openSco: T.func.isRequired
}

const Summary = props =>
  <aside className={classes('summary-container', {
    opened: props.opened,
    pinned: props.pinned
  })}>
    <SummaryHeader
      opened={props.opened}
      pinned={props.pinned}
      togglePin={props.togglePin}
      toggleOpen={props.toggleOpen}
    />

    {(0 !== props.scos.length) &&
      <ul className="summary">
        {props.scos.map(sco =>
          <SummaryLink
            key={sco.id}
            opened={props.opened}
            sco={sco}
            openSco={props.openSco}
          />
        )}
      </ul>
    }
  </aside>

Summary.propTypes = {
  scos: T.arrayOf(T.shape(ScoType.propTypes)),
  opened: T.bool.isRequired,
  pinned: T.bool.isRequired,
  togglePin: T.func.isRequired,
  toggleOpen: T.func.isRequired,
  openSco: T.func.isRequired
}

Summary.defaultProps = {
  scos: []
}

const ScormSummary = connect(
  state => ({
    opened: select.summaryOpened(state),
    pinned: select.summaryPinned(state)
  }),
  dispatch => ({
    toggleOpen() {
      dispatch(actions.toggleSummaryOpen())
    },
    togglePin() {
      dispatch(actions.toggleSummaryPin())
    }
  })
)(Summary)

export {
  ScormSummary
}
