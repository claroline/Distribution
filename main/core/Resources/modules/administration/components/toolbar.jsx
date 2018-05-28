import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {Toolbar} from '#/main/app/overlay/toolbar/components/toolbar'

import {MODAL_WORKSPACE_ABOUT} from '#/main/core/workspace/modals/about'
import {MODAL_WORKSPACE_IMPERSONATION} from '#/main/core/workspace/modals/impersonation'

import {selectors} from '#/main/core/administration/selectors'

// todo implement

const AdministrationToolbarComponent = props =>
  <Toolbar
    active={props.openedTool}
    tools={props.tools}
    actions={[
      /*{
        type: 'modal',
        icon: 'fa fa-info',
        label: trans('show-info', {}, 'actions'),
        modal: [MODAL_WORKSPACE_ABOUT, {

        }]
      }, {
        type: 'modal',
        icon: 'fa fa-user-secret',
        label: trans('view-as', {}, 'actions'),
        modal: [MODAL_WORKSPACE_IMPERSONATION, {

        }]
      }*/
    ]}
  />

AdministrationToolbarComponent.propTypes = {
  openedTool: T.string,
  tools: T.arrayOf(T.shape({
    icon: T.string.isRequired,
    name: T.string.isRequired,
    open: T.oneOfType([T.array, T.string])
  }))
}

const AdministrationToolbar = connect(
  (state) => ({
    tools: selectors.tools(state),
    openedTool: selectors.openedTool(state)
  })
)(AdministrationToolbarComponent)

export {
  AdministrationToolbar
}
