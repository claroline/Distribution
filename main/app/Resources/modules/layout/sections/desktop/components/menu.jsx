/* global window */

import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {number} from '#/main/app/intl'
import {CALLBACK_BUTTON, LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {LiquidGauge} from '#/main/core/layout/gauge/components/liquid-gauge'
import {MenuMain} from '#/main/app/layout/menu/containers/main'
import {actions as walkthroughActions} from '#/main/app/overlays/walkthrough/store'

import {MODAL_WORKSPACE_IMPERSONATION} from '#/main/core/workspace/modals/impersonation'
import {MODAL_WORKSPACE_PARAMETERS} from '#/main/core/workspace/modals/parameters'

class DesktopMenu extends Component {
  constructor(props) {
    super(props)

    // TODO : reuse new workspace standard actions
    this.state = {
      openedTool: props.tools.find(tool => props.openedTool === tool.name),
      actions: [
        {
          name: 'walkthrough',
          type: CALLBACK_BUTTON,
          icon: 'fa fa-fw fa-street-view',
          label: trans('show-walkthrough', {}, 'actions'),
          callback: () => this.startWalkthrough()
        }, {
          name: 'parameters',
          type: MODAL_BUTTON,
          icon: 'fa fa-fw fa-cog',
          label: trans('configure', {}, 'actions'),
          //displayed: hasPermission('administrate', props.workspace),
          modal: [MODAL_WORKSPACE_PARAMETERS, {
            workspace: props.workspace
          }]
        }, { //
          name: 'impersonation',
          type: MODAL_BUTTON,
          icon: 'fa fa-fw fa-mask',
          label: trans('view-as', {}, 'actions'),
          //displayed: hasPermission('administrate', props.workspace),
          modal: [MODAL_WORKSPACE_IMPERSONATION, {
            workspace: props.workspace
          }]
        }
      ]
    }
  }

  startWalkthrough() {
    this.props.startWalkthrough([])
  }

  render() {
    return (
      <MenuMain
        title={trans('desktop')}
        backAction={{
          type: LINK_BUTTON,
          icon: 'fa fa-fw fa-angle-double-left',
          label: trans('home'),
          target: '/',
          exact: true
        }}

        openedTool={this.props.openedTool}
        tools={this.props.tools}
        actions={this.state.actions}
      >
        <section className="user-progression">
          <h2 className="sr-only">
            Ma progression
          </h2>

          <LiquidGauge
            id="workspace-progression"
            type="user"
            value={25}
            displayValue={(value) => number(value) + '%'}
            width={80}
            height={80}
          />

          <div className="user-progression-info">
            Vous n'avez pas terminé toutes les activités disponibles.
          </div>
        </section>
      </MenuMain>
    )
  }
}

// <h3 className="h4">Collaborateur</h3>

DesktopMenu.propTypes = {
  openedTool: T.string,
  tools: T.arrayOf(T.shape({
    icon: T.string.isRequired,
    name: T.string.isRequired
  }))
}

DesktopMenu.defaultProps = {
  tools: []
}

export {
  DesktopMenu
}
