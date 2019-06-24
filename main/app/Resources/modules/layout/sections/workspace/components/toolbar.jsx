/* global window */

import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {hasPermission} from '#/main/app/security'
import {trans} from '#/main/app/intl/translation'
import {url} from '#/main/app/api'
import {Toolbar} from '#/main/app/overlays/toolbar/components/toolbar'
import {Button} from '#/main/app/action/components/button'
import {ASYNC_BUTTON, CALLBACK_BUTTON, LINK_BUTTON, MODAL_BUTTON, URL_BUTTON} from '#/main/app/buttons'
import {number} from '#/main/app/intl'
import {LiquidGauge} from '#/main/core/layout/gauge/components/liquid-gauge'

import {actions as walkthroughActions} from '#/main/app/overlays/walkthrough/store'

import {Workspace as WorkspaceTypes} from '#/main/core/workspace/prop-types'

import {MODAL_WORKSPACE_ABOUT} from '#/main/core/workspace/modals/about'
import {MODAL_WORKSPACE_IMPERSONATION} from '#/main/core/workspace/modals/impersonation'
import {MODAL_WORKSPACE_PARAMETERS} from '#/main/core/workspace/modals/parameters'

class WorkspaceToolbarComponent extends Component {
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
        }, { //
          name: 'about',
          type: MODAL_BUTTON,
          icon: 'fa fa-fw fa-info',
          label: trans('show-info', {}, 'actions'),
          displayed: hasPermission('open', props.workspace),
          modal: [MODAL_WORKSPACE_ABOUT, {
            workspace: props.workspace
          }]
        }, {
          name: 'parameters',
          type: MODAL_BUTTON,
          icon: 'fa fa-fw fa-cog',
          label: trans('configure', {}, 'actions'),
          displayed: hasPermission('administrate', props.workspace),
          modal: [MODAL_WORKSPACE_PARAMETERS, {
            workspace: props.workspace
          }]
        }, { //
          name: 'impersonation',
          type: MODAL_BUTTON,
          icon: 'fa fa-fw fa-mask',
          label: trans('view-as', {}, 'actions'),
          displayed: hasPermission('administrate', props.workspace),
          modal: [MODAL_WORKSPACE_IMPERSONATION, {
            workspace: props.workspace
          }]
        }, { //
          name: 'export',
          type: URL_BUTTON,
          icon: 'fa fa-fw fa-download',
          label: trans('export', {}, 'actions'),
          //displayed: hasPermission('export', props.workspace),
          displayed: false, //currently broken
          target: ['claro_workspace_export', {workspace: props.workspace.id}]
        }, { //
          name: 'delete',
          type: ASYNC_BUTTON,
          icon: 'fa fa-fw fa-trash-o',
          label: trans('delete', {}, 'actions'),
          displayed: hasPermission('delete', props.workspace),
          request: {
            type: 'delete',
            url: ['apiv2_workspace_delete_bulk', {ids: [props.workspace.id]}],
            request: {
              method: 'DELETE'
            },
            success: () => window.location = url(['claro_desktop_open'])
          },
          dangerous: true,
          confirm: {
            title: trans('workspace_delete_confirm_title'),
            subtitle: props.workspace.name,
            message: trans('workspace_delete_confirm_message')
          }
        }
      ]
    }
  }

  startWalkthrough() {
    this.props.startWalkthrough([
      {
        highlight: ['.workspace-toolbar-container'],
        content: {
          title: trans('workspace.sidebar.intro.title', {}, 'walkthrough'),
          message: trans('workspace.sidebar.intro.message', {}, 'walkthrough')
        },
        position: {
          target: '.workspace-toolbar-container',
          placement: 'right'
        }
      }, {
        highlight: ['.tools'],
        content: {
          title: trans('workspace_tools', {}, 'walkthrough'),
          message: trans('workspace.sidebar.tools_group.message', {}, 'walkthrough')
        },
        position: {
          target: '.tools',
          placement: 'right'
        }
      }
    ].concat(
      // help for active tool
      this.state.openedTool ? [{
        highlight: [`#tool-link-${this.state.openedTool.name}`],
        content: {
          message: trans('workspace.sidebar.opened_tool.message', {}, 'walkthrough')
        },
        position: {
          target: `#tool-link-${this.state.openedTool.name}`,
          placement: 'right'
        }
      }] : [],
      // help for each tool
      this.props.tools.map(tool => ({
        highlight: [`#tool-link-${tool.name}`],
        content: {
          icon: `fa fa-${tool.icon}`,
          title: trans('tool', {toolName: trans(tool.name, {}, 'tools')}, 'walkthrough'),
          message: trans(`workspace.tools.${tool.name}.message`, {}, 'walkthrough'),
          link: trans(`workspace.tools.${tool.name}.documentation`, {}, 'walkthrough')
        },
        position: {
          target: `#tool-link-${tool.name}`,
          placement: 'right'
        }
      })),
      // help for action group
      [{
        highlight: ['.additional-tools'],
        content: {
          title: trans('actions', {}, 'walkthrough'),
          message: trans('workspace.sidebar.actions_group.message', {}, 'walkthrough')
        },
        position: {
          target: '.additional-tools',
          placement: 'right'
        }
      }],
      // help for each displayed action
      this.state.actions
        .filter(action => undefined === action.displayed || action.displayed)
        .map(action => ({
          highlight: [`#action-link-${action.name}`],
          content: {
            icon: action.icon,
            title: trans('action', {actionName: action.label}, 'walkthrough'),
            message: trans(`workspace.actions.${action.name}`, {}, 'walkthrough')
          },
          position: {
            target: `#action-link-${action.name}`,
            placement: 'right'
          }
        }))
    ))
  }

  render() {
    /*return (
      <Toolbar
        active={this.props.openedTool}
        tools={this.props.tools}
        actions={this.state.actions}
      />
    )*/

    return (
      <aside className="app-menu">
        <Button
          type={LINK_BUTTON}
          className="tool-link"
          icon="fa fa-angle-double-left"
          label="Espaces d'activités"
          target="/workspaces"
        />

        <h1 className="app-menu-title h6">{this.props.workspace.name}</h1>

        <section className="user-progression">
          <h2 className="sr-only">
            Ma progression
          </h2>

          <LiquidGauge
            id="workspace-progression"
            type="user"
            value={25}
            displayValue={(value) => number(value)}
            unit="%"
            width={80}
            height={80}
          />

          <div className="user-progression-info">
            <h3 className="h4">Collaborateur</h3>
            Vous n'avez pas terminé toutes les activités disponibles.
          </div>
        </section>

        <nav className="current-tool">
          <h2 className="h4">
            Accueil
          </h2>
        </nav>

        <nav>
          <h2 className="h4">
            <span className="fa fa-fw fa-street-view icon-with-text-right" />
            Tutoriels
          </h2>
        </nav>

        <nav>
          <h2 className="h4">
            <span className="fa fa-fw fa-history icon-with-text-right" />
            Historique
          </h2>
        </nav>

        <nav>
          <h2 className="h4">
            <span className="fa fa-fw fa-tools icon-with-text-right" />
            Outils
          </h2>
        </nav>

        <nav>
          <h2 className="h4">
            <span className="fa fa-fw fa-ellipsis-v icon-with-text-right" />
            Plus
          </h2>
        </nav>
      </aside>
    )
  }
}

WorkspaceToolbarComponent.propTypes = {
  workspace: T.shape(
    WorkspaceTypes.propTypes
  ).isRequired,
  openedTool: T.string,
  tools: T.arrayOf(T.shape({
    icon: T.string.isRequired,
    name: T.string.isRequired,
    open: T.oneOfType([T.array, T.string])
  })),
  startWalkthrough: T.func.isRequired
}

// todo : remove the container when the toolbar will be moved in the main app
// (that's why it's in the components folder)
const WorkspaceToolbar = connect(
  null,
  (dispatch) => ({
    startWalkthrough(steps) {
      dispatch(walkthroughActions.start(steps))
    }
  })
)(WorkspaceToolbarComponent)

export {
  WorkspaceToolbar
}
