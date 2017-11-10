import React from 'react'

import {t} from '#/main/core/translation'

import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {makeSaveAction} from '#/main/core/layout/form/containers/form-save.jsx'
import {FormContainer as Form} from '#/main/core/layout/form/containers/form.jsx'

const UserSaveAction = makeSaveAction('users.current')(PageAction)

const UserActions = () =>
  <PageActions>
    <UserSaveAction />

    <PageAction
      id="users-list"
      icon="fa fa-list"
      title={t('cancel')}
      action="#/users"
    />
  </PageActions>

const User = () =>
  <Form
    level={3}
    name="users.current"
    sections={[
      {
        id: 'general',
        title: t('general'),
        primary: true,
        fields: [
          {
            name: 'username',
            type: 'string',
            label: t('username')
          }
        ]
      }
    ]}
  />

export {
  UserActions,
  User
}
