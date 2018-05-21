/* global window */

import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {url} from '#/main/app/api'
import {Toolbar} from '#/main/app/overlay/toolbar/components/toolbar'

import {Workspace as WorkspaceTypes} from '#/main/core/workspace/prop-types'
import {hasPermission} from '#/main/core/workspace/permissions'

import {MODAL_WORKSPACE_ABOUT} from '#/main/core/workspace/modals/about'
import {MODAL_WORKSPACE_IMPERSONATION} from '#/main/core/workspace/modals/impersonation'
import {MODAL_WORKSPACE_PARAMETERS} from '#/main/core/workspace/modals/parameters'

const WorkspaceToolbar = props =>
  <Toolbar
    active={props.openedTool}
    primary={props.tools[0]}
    tools={props.tools.slice(1)}
    actions={[
      {
        type: 'modal',
        icon: 'fa fa-info',
        label: trans('show-info', {}, 'actions'),
        displayed: hasPermission('open', props.workspace),
        modal: [MODAL_WORKSPACE_ABOUT, {
          workspace: props.workspace
        }]
      }, {
        type: 'modal',
        icon: 'fa fa-cog',
        label: trans('configure', {}, 'actions'),
        displayed: hasPermission('administrate', props.workspace),
        modal: [MODAL_WORKSPACE_PARAMETERS, {
          workspace: props.workspace
        }]
      }, {
        type: 'modal',
        icon: 'fa fa-user-secret',
        label: trans('view-as', {}, 'actions'),
        displayed: hasPermission('administrate', props.workspace),
        modal: [MODAL_WORKSPACE_IMPERSONATION, {
          workspace: props.workspace
        }]
      }, {
        type: 'url',
        icon: 'fa fa-download',
        label: trans('export', {}, 'actions'),
        displayed: hasPermission('export', props.workspace),
        target: ['claro_workspace_export', {workspace: props.workspace.id}]
      }, {
        type: 'async',
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
          message: trans('workspace_delete_confirm_message')
        }
      }
    ]}
  />

WorkspaceToolbar.propTypes = {
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

export {
  WorkspaceToolbar
}
