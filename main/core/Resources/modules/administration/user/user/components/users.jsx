import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'

import {DataListContainer} from '#/main/core/data/list/containers/data-list'
import {actions as modalActions} from '#/main/app/overlay/modal/store'
import {MODAL_USER_PASSWORD} from '#/main/core/user/modals/password'
import {actions as userActions} from '#/main/core/user/actions'

import {actions} from '#/main/core/administration/user/user/actions'
import {UserList} from '#/main/core/administration/user/user/components/user-list'

// todo : restore custom actions the same way resource actions

const UsersList = props =>
  <DataListContainer
    name="users.list"
    fetch={{
      url: ['apiv2_user_list_managed_organization'],
      autoload: true
    }}
    delete={{
      url: ['apiv2_user_delete_bulk']
    }}

    primaryAction={UserList.open}
    actions={(rows) => [
      {
        type: 'url',
        icon: 'fa fa-fw fa-id-card-o',
        label: trans('show_profile'),
        target: ['claro_user_profile', {publicUrl: rows[0].meta.publicUrl}],
        context: 'row'
      }, {
        type: 'callback',
        icon: 'fa fa-fw fa-lock',
        label: trans('change_password'),
        context: 'row',
        callback: () => props.updatePassword(rows[0]),
        dangerous: true
      }, {
        type: 'url',
        icon: 'fa fa-fw fa-line-chart',
        label: trans('show_tracking'),
        target: ['claro_user_tracking', {publicUrl: rows[0].meta.publicUrl}],
        context: 'row'
      }, {
        type: 'url',
        icon: 'fa fa-fw fa-user-secret',
        label: trans('show_as'),
        target: ['claro_desktop_open', {_switch: rows[0].username}],
        context: 'row'
      }, {
        type: 'callback',
        icon: 'fa fa-fw fa-check-circle-o',
        label: trans('enable_user'),
        context: 'row', // todo should be a selection action too
        displayed: rows[0].restrictions.disabled,
        callback: () => props.enable(rows[0])
      }, {
        type: 'callback',
        icon: 'fa fa-fw fa-times-circle-o',
        label: trans('disable_user'),
        context: 'row', // todo should be a selection action too
        displayed: !rows[0].restrictions.disabled,
        callback: () => props.disable(rows[0]),
        dangerous: true
      }, {
        type: 'callback',
        icon: 'fa fa-fw fa-book',
        label: trans('enable_personal_ws'),
        context: 'row', // todo should be a selection action too
        displayed: !rows[0].meta.personalWorkspace,
        callback: () => props.createWorkspace(rows[0])
      }, {
        type: 'callback',
        icon: 'fa fa-fw fa-book',
        label: trans('disable_personal_ws'),
        context: 'row', // todo should be a selection action too
        displayed: rows[0].meta.personalWorkspace,
        callback: () => props.deleteWorkspace(rows[0]),
        dangerous: true
      }
    ]}
    definition={UserList.definition}
    card={UserList.card}
  />

UsersList.propTypes = {
  enable: T.func.isRequired,
  disable: T.func.isRequired,
  createWorkspace: T.func.isRequired,
  deleteWorkspace: T.func.isRequired,
  updatePassword: T.func.isRequired
}

const Users = connect(
  null,
  dispatch => ({
    enable(user) {
      dispatch(actions.enable(user))
    },
    disable(user) {
      // todo add confirm
      dispatch(actions.disable(user))
    },
    createWorkspace(user) {
      dispatch(actions.createWorkspace(user))
    },
    deleteWorkspace(user) {
      // todo add confirm
      dispatch(actions.deleteWorkspace(user))
    },
    updatePassword(user) {
      dispatch(
        modalActions.showModal(MODAL_USER_PASSWORD, {
          changePassword: (password) => dispatch(userActions.updatePassword(user, password))
        })
      )
    }
  })
)(UsersList)

export {
  Users
}
