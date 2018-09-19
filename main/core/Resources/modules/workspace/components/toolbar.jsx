/* global window */

import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {url} from '#/main/app/api'
import {Toolbar} from '#/main/app/overlay/toolbar/components/toolbar'
import {ASYNC_BUTTON, MODAL_BUTTON, URL_BUTTON} from '#/main/app/buttons'

import {WalkthroughOverlay} from '#/main/app/overlay/walkthrough/containers/overlay'

import {Workspace as WorkspaceTypes} from '#/main/core/workspace/prop-types'
import {hasPermission} from '#/main/core/workspace/permissions'
import {select} from '#/main/core/workspace/selectors'

import {MODAL_WORKSPACE_ABOUT} from '#/main/core/workspace/modals/about'
import {MODAL_WORKSPACE_IMPERSONATION} from '#/main/core/workspace/modals/impersonation'
import {MODAL_WORKSPACE_PARAMETERS} from '#/main/core/workspace/modals/parameters'

const WorkspaceToolbarComponent = props => {
  const openedTool = props.tools.find(tool => props.openedTool === tool.name)
  const actions = [
    {
      name: 'walkthrough',
      type: MODAL_BUTTON,
      icon: 'fa fa-street-view',
      label: trans('show-walkthrough', {}, 'actions'),
      modal: []
    }, {
      name: 'about',
      type: MODAL_BUTTON,
      icon: 'fa fa-info',
      label: trans('show-info', {}, 'actions'),
      displayed: hasPermission('open', props.workspace),
      modal: [MODAL_WORKSPACE_ABOUT, {
        workspace: props.workspace
      }]
    }, {
      name: 'parameters',
      type: MODAL_BUTTON,
      icon: 'fa fa-cog',
      label: trans('configure', {}, 'actions'),
      displayed: hasPermission('administrate', props.workspace),
      modal: [MODAL_WORKSPACE_PARAMETERS, {
        workspace: props.workspace
      }]
    }, {
      name: 'impersonation',
      type: MODAL_BUTTON,
      icon: 'fa fa-user-secret',
      label: trans('view-as', {}, 'actions'),
      displayed: hasPermission('administrate', props.workspace),
      modal: [MODAL_WORKSPACE_IMPERSONATION, {
        workspace: props.workspace
      }]
    }, {
      name: 'export',
      type: URL_BUTTON,
      icon: 'fa fa-download',
      label: trans('export', {}, 'actions'),
      //displayed: hasPermission('export', props.workspace),
      displayed: false, //currently broken
      target: ['claro_workspace_export', {workspace: props.workspace.id}]
    }, {
      name: 'delete',
      type: ASYNC_BUTTON,
      icon: 'fa fa-trash-o',
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

  return (
    <Toolbar
      active={props.openedTool}
      tools={props.tools}
      actions={actions}
    >
      <WalkthroughOverlay
        steps={[
          {
            highlight: ['.workspace-toolbar-container'],
            content: {
              title: trans('workspace.sidebar.title', {}, 'walkthrough'),
              message: trans('workspace.sidebar.general', {}, 'walkthrough')
            },
            position: {
              target: '.workspace-toolbar-container',
              placement: 'right'
            }
          }, {
            highlight: ['.tools'],
            content: {
              title: trans('tools'),
              message: trans('workspace.sidebar.tools-group', {}, 'walkthrough')
            },
            position: {
              target: '.tools',
              placement: 'right'
            }
          }
        ].concat(
          // help for active tool
          openedTool ? [{
            highlight: [`#tool-link-${openedTool.name}`],
            content: {
              message: trans(`workspace.sidebar.opened-tool`, {}, 'walkthrough')
            },
            position: {
              target: `#tool-link-${openedTool.name}`,
              placement: 'right'
            }
          }] : [],
          // help for each tool
          props.tools.map(tool => ({
            highlight: [`#tool-link-${tool.name}`],
            content: {
              title: trans('tool', {toolName: trans(tool.name, {}, 'tools')}, 'walkthrough'),
              message: trans(`workspace.tools.${tool.name}`, {}, 'walkthrough')
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
              title: trans('actions'),
              message: trans('workspace.sidebar.actions-group', {}, 'walkthrough')
            },
            position: {
              target: '.additional-tools',
              placement: 'right'
            }
          }],
          // help for each displayed action
          actions
            .filter(action => undefined === action.displayed || action.displayed)
            .map(action => ({
              highlight: [`#action-link-${action.name}`],
              content: {
                title: trans('action', {actionName: action.label}, 'walkthrough'),
                message: trans(`workspace.actions.${action.name}`, {}, 'walkthrough')
              },
              position: {
                target: `#action-link-${action.name}`,
                placement: 'right'
              }
            })),
          [{
            highlight: [`#action-link-walkthrough`],
            content: {
              message: trans('workspace.sidebar.end', {}, 'walkthrough')
            }
          }]
        )}
      />
    </Toolbar>
  )
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
  }))
}

// todo : remove the container when the toolbar will be moved in the main app
// (that's why it's in the components folder)
const WorkspaceToolbar = connect(
  (state) => ({
    workspace: select.workspace(state),
    tools: select.tools(state),
    openedTool: select.openedTool(state)
  })
)(WorkspaceToolbarComponent)

export {
  WorkspaceToolbar
}
