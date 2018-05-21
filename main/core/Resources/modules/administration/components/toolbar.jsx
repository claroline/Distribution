import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {Toolbar} from '#/main/app/overlay/toolbar/components/toolbar'

import {MODAL_WORKSPACE_ABOUT} from '#/main/core/workspace/modals/about'
import {MODAL_WORKSPACE_IMPERSONATION} from '#/main/core/workspace/modals/impersonation'

const AdministrationToolbar = props =>
  <Toolbar
    active={props.openedTool}
    primary={props.tools[0]}
    tools={props.tools.slice(1)}
    actions={[
      {
        type: 'modal',
        icon: 'fa fa-info',
        label: trans('show-info', {}, 'actions'),
        modal: [MODAL_WORKSPACE_ABOUT, {
          workspace: props.workspace
        }]
      }, {
        type: 'modal',
        icon: 'fa fa-user-secret',
        label: trans('view-as', {}, 'actions'),
        modal: [MODAL_WORKSPACE_IMPERSONATION, {
          workspace: props.workspace
        }]
      }
    ]}
  />

AdministrationToolbar.propTypes = {
  openedTool: T.string,
  tools: T.arrayOf(T.shape({
    icon: T.string.isRequired,
    name: T.string.isRequired,
    open: T.oneOfType([T.array, T.string])
  }))
}

export {
  AdministrationToolbar
}
