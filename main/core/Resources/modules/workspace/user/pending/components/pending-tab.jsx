import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'

import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'

import {actions as modalActions} from '#/main/app/overlay/modal/store'
import {actions as pendingActions} from '#/main/core/workspace/user/pending/actions'
import {MODAL_CONFIRM_REGISTRATION} from '#/main/core/workspace/user/pending/components/modal/confirm-registration.jsx'
import {MODAL_CONFIRM_REMOVE} from '#/main/core/workspace/user/pending/components/modal/confirm-remove.jsx'
import {UserList} from '#/main/core/administration/user/user/components/user-list.jsx'

import {select} from '#/main/core/workspace/user/selectors'

const PendingList = props =>
  <DataListContainer
    name="pending.list"
    fetch={{
      url: ['apiv2_workspace_list_pending', {id: props.workspace.uuid}],
      autoload: true
    }}
    primaryAction={UserList.open}
    actions={(rows) => [{
      type: 'callback',
      icon: 'fa fa-fw fa-check',
      label: trans('validate'),
      callback: () => {
        props.register(rows, props.workspace)
      }
    }, {
      type: 'callback',
      icon: 'fa fa-fw fa-check',
      label: trans('remove'),
      callback: () => props.remove(rows, props.workspace)
    }
    ]}
    definition={UserList.definition}
    card={UserList.card}
  />

PendingList.propTypes = {
  workspace: T.object,
  register: T.func,
  remove: T.func
}

const PendingTab = connect(
  state => ({
    workspace: select.workspace(state)
  }),
  dispatch => ({
    register(users, workspace) {
      dispatch(
        modalActions.showModal(MODAL_CONFIRM_REGISTRATION, {
          //make a user id list after that
          register: (users, workspace) => dispatch(pendingActions.register(users, workspace)),
          users: users,
          workspace: workspace
        })
      )
    },
    remove(users, workspace) {
      dispatch(
        modalActions.showModal(MODAL_CONFIRM_REMOVE, {
          //make a user id list after that
          remove: (users, workspace) => dispatch(pendingActions.remove(users, workspace)),
          users: users,
          workspace: workspace
        })
      )
    }
  })
)(PendingList)

export {
  PendingTab
}
