import React from 'react'

import {t} from '#/main/core/translation'

import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {makeSaveAction} from '#/main/core/layout/form/containers/form-save.jsx'
import {FormContainer as Form} from '#/main/core/layout/form/containers/form.jsx'

const LocationSaveAction = makeSaveAction('locations.current', formData => ({
  create: ['apiv2_location_create'],
  update: ['apiv2_location_update', {id: formData.id}]
}))(PageAction)

const LocationActions = () =>
  <PageActions>
    <LocationSaveAction />

    <PageAction
      id="location-list"
      icon="fa fa-list"
      title={t('cancel')}
      action="#/locations"
    />
  </PageActions>

const Location = () =>
  <Form
    level={3}
    name="locations.current"
    sections={[
      {
        id: 'general',
        title: t('general'),
        primary: true,
        fields: [
          {name: 'name', type: 'string', label: t('name'), required: true},
          {name: 'boxNumber', type: 'string', label: t('box_number')},
          {name: 'streetNumber', type: 'string', label: t('street_number'), required: true},
          {name: 'street', type: 'string', label: t('street'), required: true},
          {name: 'pc', type: 'string', label: t('postal_code'), required: true},
          {name: 'town', type: 'string', label: t('town'), required: true},
          {name: 'country', type: 'string', label: t('country'), required: true},
          {name: 'phone', type: 'text', label: t('phone')}
        ]
      }
    ]}
  />

export {
  LocationActions,
  Location
}
