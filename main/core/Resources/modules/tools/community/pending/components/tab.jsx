import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'
import {ToolPage} from '#/main/core/tool/containers/page'

import {UserCard} from '#/main/core/user/components/card'
import {constants} from '#/main/core/user/constants'
import {selectors} from '#/main/core/tools/community/pending/store'

// TODO : reuse main/core/user/components/list

const PendingTab = props =>
  <ToolPage
    subtitle={trans('pending_registrations')}
  >
    <ListData
      name={selectors.LIST_NAME}
      fetch={{
        url: ['apiv2_workspace_list_pending', {id: props.workspace.uuid}],
        autoload: true
      }}
      primaryAction={(row) => ({
        type: LINK_BUTTON,
        target: props.path + '/profile/' + row.meta.publicUrl
      })}
      actions={(rows) => [{
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-check',
        label: trans('validate', {}, 'actions'),
        callback: () => props.register(rows, props.workspace),
        confirm: {
          title: trans('user_registration'),
          message: trans('workspace_user_register_validation_message', {users: rows.map(user => user.username).join(',')})
        }
      }, {
        type: CALLBACK_BUTTON,
        icon: 'fa fa-fw fa-ban',
        label: trans('delete', {}, 'actions'),
        callback: () => props.remove(rows, props.workspace),
        confirm: {
          title: trans('user_remove'),
          message: trans('workspace_user_remove_validation_message', {users: rows.map(user => user.username).join(',')})
        }
      }]}
      definition={[
        {
          name: 'username',
          type: 'username',
          label: trans('username'),
          displayed: true,
          primary: true
        }, {
          name: 'lastName',
          type: 'string',
          label: trans('last_name'),
          displayed: true
        }, {
          name: 'firstName',
          type: 'string',
          label: trans('first_name'),
          displayed: true
        }, {
          name: 'email',
          alias: 'mail',
          type: 'email',
          label: trans('email'),
          displayed: true
        }, {
          name: 'administrativeCode',
          type: 'string',
          label: trans('code')
        }, {
          name: 'meta.lastLogin',
          type: 'date',
          alias: 'lastLogin',
          label: trans('last_login'),
          displayed: true,
          options: {
            time: true
          }
        }, {
          name: 'roles',
          alias: 'role',
          type: 'roles',
          label: trans('roles'),
          calculated: (user) => !isEmpty(props.workspace) ?
            user.roles.filter(role => role.workspace && role.workspace.id === props.workspace.uuid)
            :
            user.roles.filter(role => constants.ROLE_PLATFORM === role.type),
          displayed: true,
          filterable: true
        }
      ]}
      card={UserCard}
    />
  </ToolPage>

PendingTab.propTypes = {
  path: T.string.isRequired,
  workspace: T.object,
  register: T.func,
  remove: T.func
}

export {
  PendingTab
}
