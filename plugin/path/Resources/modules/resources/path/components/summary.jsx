import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import classes from 'classnames'

import {trans} from '#/main/core/translation'
import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {TooltipAction} from '#/main/core/layout/button/components/tooltip-action.jsx'
import {Action as ActionTypes} from '#/main/core/layout/action/prop-types'

import {actions, selectors} from '#/plugin/path/resources/path/store'
import {Step as StepTypes} from '#/plugin/path/resources/path/prop-types'

// TODO : reuse app summary

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
      collapsible: props.step.children && 0 !== props.step.children.length,
      collapsed: false
    }
  }

  render() {
    return (
      <li className="summary-link-container">
        <div className="summary-link">
          <Button
            type={LINK_BUTTON}
            tooltip={!this.props.opened ? 'right' : undefined}
            icon={classes('step-progression fa fa-circle', this.props.step.userProgression && this.props.step.userProgression.status)}
            label={this.props.step.title}
            target={`/${this.props.prefix}/${this.props.step.id}`}
          />

          {(this.props.opened && (this.state.collapsible || 0 !== this.props.actions.length)) &&
            <div className="step-actions">
              {this.props.actions
                .filter(action => undefined === action.displayed || action.displayed)
                .map((action, actionIndex) =>
                  <TooltipAction
                    {...action}
                    key={actionIndex}
                    id={`step-${this.props.step.id}-${actionIndex}`}
                    position="bottom"
                    className="btn-link btn-summary"
                    action={typeof action.action === 'string' ? action.action : () => action.action(this.props.step)}
                  />
                )
              }

              {this.state.collapsible &&
                <TooltipAction
                  id={`step-${this.props.step.id}-collapse`}
                  position="bottom"
                  className="btn-link btn-summary"
                  icon={classes('fa', {
                    'fa-caret-right': this.state.collapsed,
                    'fa-caret-down': !this.state.collapsed
                  })}
                  label={trans(this.state.collapsed ? 'expand_step':'collapse_step', {}, 'path')}
                  action={() => this.setState({collapsed: !this.state.collapsed})}
                />
              }
            </div>
          }
        </div>

        {!this.state.collapsed && this.props.step.children.length > 0 &&
          <ul className="step-children">
            {this.props.step.children.map(child =>
              <SummaryLink
                key={`summary-step-${child.id}`}
                prefix={this.props.prefix}
                opened={this.props.opened}
                step={child}
                actions={this.props.actions}
              />
            )}
          </ul>
        }
      </li>
    )
  }
}

SummaryLink.propTypes = {
  prefix: T.string.isRequired,
  opened: T.bool.isRequired,
  step: T.shape(
    StepTypes.propTypes
  ).isRequired,
  actions: T.arrayOf(T.shape(
    ActionTypes.propTypes
  ))
}

SummaryLink.defaultProps = {
  actions: []
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

    {(0 !== props.steps.length || props.add || props.parameters) &&
      <ul className="summary">
        {props.parameters &&
          <li className="summary-link-container">
            <div className="summary-link">
              <Button
                type={LINK_BUTTON}
                tooltip={!props.opened ? 'right' : undefined}
                icon="fa fa-cog"
                label={trans('parameters')}
                target={`/${props.prefix}/parameters`}
              />
            </div>
          </li>
        }

        {props.steps.map(step =>
          <SummaryLink
            key={step.id}
            prefix={props.prefix}
            opened={props.opened}
            step={step}
            actions={props.actions}
          />
        )}

        {props.add &&
          <li className="summary-link-container">
            <div className="summary-link">
              <Button
                type={CALLBACK_BUTTON}
                tooltip={!props.opened ? 'right' : undefined}
                icon="fa fa-plus"
                label={trans('step_add', {}, 'path')}
                callback={() => props.add(null)}
              />
            </div>
          </li>
        }
      </ul>
    }
  </aside>

Summary.propTypes = {
  prefix: T.string.isRequired,
  steps: T.arrayOf(T.shape(
    StepTypes.propTypes
  )),
  actions: T.arrayOf(T.shape(
    ActionTypes.propTypes
  )),
  opened: T.bool.isRequired,
  pinned: T.bool.isRequired,
  togglePin: T.func.isRequired,
  toggleOpen: T.func.isRequired,
  add: T.func,
  parameters: T.bool
}

Summary.defaultProps = {
  steps: [],
  actions: []
}

const PathSummary = connect(
  state => ({
    opened: selectors.summaryOpened(state),
    pinned: selectors.summaryPinned(state)
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
  PathSummary
}
