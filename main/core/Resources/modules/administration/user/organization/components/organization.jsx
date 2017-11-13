import React from 'react'

import {t} from '#/main/core/translation'

import {PageGroupActions, PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {makeSaveAction} from '#/main/core/layout/form/containers/form-save.jsx'
import {FormContainer as Form} from '#/main/core/layout/form/containers/form.jsx'

const OrganizationSaveAction = makeSaveAction('organizations.current', formData => ({
  create: ['apiv2_organization_create'],
  update: ['apiv2_organization_update', {id: formData.id}]
}))(PageAction)

const OrganizationActions = props =>
  <PageActions>
    <PageGroupActions>
      <PageAction
        id="organization-delete"
        icon="fa fa-trash-o"
        title={t('delete')}
        action={() => true}
        dangerous={true}
      />
    </PageGroupActions>

    <PageGroupActions>
      <OrganizationSaveAction />

      <PageAction
        id="organization-list"
        icon="fa fa-list"
        title={t('back_to_list')}
        action="#/organizations"
      />
    </PageGroupActions>
  </PageActions>

const Organization = () =>
  <Form
    level={3}
    name="organizations.current"
    sections={[
      {
        id: 'general',
        title: t('general'),
        primary: true,
        fields: [
          {
            name: 'name',
            type: 'string',
            label: t('name')
          }, {
            name: 'code',
            type: 'string',
            label: t('code')
          }, {
            name: 'email',
            type: 'email',
            label: t('email')
          }
        ]
      }
    ]}
  />

export {
  OrganizationActions,
  Organization
}
