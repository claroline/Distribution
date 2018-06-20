import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {DataListContainer} from '#/main/core/data/list/containers/data-list'

import {WorkspaceList} from '#/main/core/workspace/list/components/workspace-list.jsx'
import {actions} from '#/main/core/workspace/list/actions'
import {trans, transChoice} from '#/main/core/translation'

import {MODAL_CONFIRM} from '#/main/app/modals/confirm'
import '#/main/core/data/form/modals'
import {actions as modalActions} from '#/main/app/overlay/modal/store'

const WorkspacesList = props =>
  <DataListContainer
    name="workspaces.list"
    fetch={{
      url: ['apiv2_workspace_displayable_list'],
      autoload: true
    }}
    definition={WorkspaceList.definition}
    primaryAction={WorkspaceList.open}
    card={WorkspaceList.card}
    actions={(rows) => [
      {
        type: 'callback',
        icon: 'fa fa-fw fa-book',
        label: trans('register'),
        displayed: rows[0].registration.selfRegistration && !rows[0].permissions['open'],
        scope: ['object'],
        callback: () => props.register(rows)
      },
      {
        type: 'callback',
        icon: 'fa fa-fw fa-book',
        label: trans('unregister'),
        dangerous: true,
        displayed: rows[0].registration.selfUnregistration && rows[0].permissions['open'],
        scope: ['object'],
        callback: () => props.unregister(rows)
      }
    ]}
  />

WorkspacesList.propTypes = {
  register: T.func.isRequired,
  unregister: T.func.isRequired
}

const Workspaces = connect(
  null,
  dispatch => ({
    register(workspaces) {
      dispatch(
        modalActions.showModal(MODAL_CONFIRM, {
          icon: 'fa fa-fw fa-users',
          title: 'register',
          question: 'register',
          handleConfirm: () => alert('brah')
        })
      )
    },
    unregister(workspaces) {
      dispatch(
        modalActions.showModal(MODAL_CONFIRM, {
          icon: 'fa fa-fw fa-users',
          title: trans('unregister_groups'),
          question: trans('unregister_groups'),
          dangerous: true,
          handleConfirm: () => alert('bruh')
        })
      )
    }
  })
)(WorkspacesList)

export {
  Workspaces
}
