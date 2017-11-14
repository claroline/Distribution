import React from 'react'

import {t} from '#/main/core/translation'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {makeSaveAction} from '#/main/core/layout/form/containers/form-save.jsx'
import {FormContainer as Form} from '#/main/core/layout/form/containers/form.jsx'

const RoleSaveAction = makeSaveAction('roles.current', formData => ({
  create: ['apiv2_role_create'],
  update: ['apiv2_role_update', {id: formData.id}]
}))(PageAction)

const RoleActions = props =>
  <PageActions>
    <RoleSaveAction />

    <PageAction
      id="roles-list"
      icon="fa fa-list"
      title={t('cancel')}
      action="#/roles"
    />
  </PageActions>

const Role = props =>
  <Form
    level={3}
    name="roles.current"
    sections={[
      {
        id: 'general',
        title: t('general'),
        primary: true,
        fields: [
          {
            name: 'translationKey',
            type: 'string',
            label: t('name')
          }
        ]
      }
    ]}
  />

Role.propTypes = {

}

export {
  RoleActions,
  Role
}
