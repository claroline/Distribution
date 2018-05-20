/* global window */

import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Responsive} from '#/main/app/components/responsive'
import {Button} from '#/main/app/action/components/button'
import {trans} from '#/main/core/translation'
import {url} from '#/main/core/api'
import {toKey} from '#/main/core/scaffolding/text/utils'
import {ModalOverlay} from '#/main/app/overlay/modal/containers/overlay'

import {Workspace as WorkspaceTypes} from '#/main/core/workspace/prop-types'
import {hasPermission} from '#/main/core/workspace/permissions'

import {MODAL_WORKSPACE_ABOUT} from '#/main/core/workspace/modals/about'
import {MODAL_WORKSPACE_IMPERSONATION} from '#/main/core/workspace/modals/impersonation'
import {MODAL_WORKSPACE_PARAMETERS} from '#/main/core/workspace/modals/parameters'

const ToolLink = props =>
  <Button
    className="tool-link"
    type="url"
    icon={`fa fa-${props.icon}`}
    label={trans(props.name, {}, 'tools')}
    tooltip="right"
    target={props.target}
    active={props.active}
  />

ToolLink.propTypes = {
  icon: T.string.isRequired,
  name: T.string.isRequired,
  target: T.array.isRequired,
  active: T.bool
}

const ToolbarDefault = props => {
  const defaultTool = props.tools[0]
  const otherTools = props.tools.slice(1)

  const actions = [
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
  ]

  // todo
  const activeTool = defaultTool.name

  return (
    <nav>
      <ToolLink
        icon={defaultTool.icon}
        name={defaultTool.name}
        target={['claro_workspace_open_tool', {workspaceId: props.workspace.id, toolName: defaultTool.name}]}
        active={activeTool === defaultTool.name}
      />

      <nav className="tools">
        {otherTools.map(tool =>
          <ToolLink
            key={tool.name}
            icon={tool.icon}
            name={tool.name}
            target={['claro_workspace_open_tool', {workspaceId: props.workspace.id, toolName: tool.name}]}
            active={activeTool === tool.name}
          />
        )}
      </nav>

      <nav className="additional-tools">
        {actions
          .filter(action => action.displayed)
          .map(action =>
            <Button
              {...action}
              key={toKey(action.label)}
              className="tool-link"
              tooltip="right"
            />
          )
        }
      </nav>

      <ModalOverlay />
    </nav>
  )
}

const ToolbarSmall = props =>
  <nav>
    I'm a XS toolbar
  </nav>

const WorkspaceToolbar = props =>
  <Responsive
    xs={<ToolbarSmall {...props} />}
    default={<ToolbarDefault {...props} />}
  />

WorkspaceToolbar.propTypes = {
  workspace: T.shape(
    WorkspaceTypes.propTypes
  ).isRequired,
  openedTool: T.string,
  tools: T.arrayOf(T.shape({
    icon: T.string.isRequired,
    name: T.string.isRequired
  }))
}

export {
  WorkspaceToolbar
}
