import React from 'react'

import {ListData} from '#/main/app/content/list/containers/data'
import {UserCard} from '#/main/core/user/components/card'
import {URL_BUTTON} from '#/main/app/buttons'

import {selectors} from '#/main/core/tools/users/store'
import {trans} from '#/main/app/intl/translation'

const Users = () =>
  <ListData
    name={selectors.STORE_NAME + '.users.list'}
    fetch={{
      url: ['apiv2_users_picker_list'],
      autoload: true
    }}
    primaryAction={(row) => ({
      type: URL_BUTTON,
      target: '#/desktop/users/profile/'+ row.meta.publicUrl
    })}
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
        name: 'meta.lastLogin',
        type: 'date',
        alias: 'lastLogin',
        label: trans('last_login'),
        displayed: true,
        options: {
          time: true
        }
      }]}
    card={UserCard}
  />

export {
  Users
}
