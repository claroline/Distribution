import React from 'react'

import {t} from '#/main/core/translation'

import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

/**
 * @constructor
 */
const Organization = () =>
  <FormContainer
    level={2}
    name="user"
    sections={[
      {
        id: 'general',
        title: t('general'),
        primary: true,
        fields: [
          {
            name: 'mainOrganization.name',
            type: 'string',
            label: t('name'),
            required: true
          }, {
            name: 'mainOrganization.code',
            type: 'string',
            label: t('code'),
            required: true
          }, {
            name: 'mainOrganization.type',
            type: 'enum',
            label: t('type'),
            required: true,
            options: {choices: {
              'external': 'external',
              'internal': 'internal'
            }}
          }, {
            name: 'mainOrganization.vat',
            label: t('vat_number'),
            type: 'string',
            required: false
          }, {
            name: 'mainOrganization.parent',
            type: 'organization',
            label: t('parent')
          },  {
            name: 'mainOrganization.email',
            type: 'email',
            label: t('email')
          }
        ]
      }
    ]}
/>

export {
  Organization
}
