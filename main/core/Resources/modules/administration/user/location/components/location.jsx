import React from 'react'

import {t} from '#/main/core/translation'

import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {makeSaveAction} from '#/main/core/data/form/containers/form-save.jsx'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'
import {DataListContainer} from '#/main/core/data/list/containers/data-list.jsx'

import {OrganizationList} from '#/main/core/administration/user/organization/components/organization-list.jsx'
import {UserList} from '#/main/core/administration/user/user/components/user-list.jsx'

import {locationTypes} from '#/main/core/administration/user/location/constants'

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

const Location = props =>
  <FormContainer
    level={3}
    name="locations.current"
    sections={[
      {
        id: 'general',
        title: t('general'),
        primary: true,
        fields: [
          {name: 'name', type: 'string', label: t('name'), required: true},
          {name: 'meta.type', type: 'enum', label: t('type'), options: {choices: locationTypes}}
        ]
      }, {
        id: 'contact',
        title: t('contact'),
        icon: 'fa fa-fw fa-address-card',
        fields: [
          {name: 'phone', type: 'text', label: t('phone')},
          {name: 'street', type: 'string', label: t('street'), required: true},
          {name: 'boxNumber', type: 'string', label: t('box_number')},
          {name: 'streetNumber', type: 'string', label: t('street_number'), required: true},
          {name: 'zipCode', type: 'string', label: t('postal_code'), required: true},
          {name: 'town', type: 'string', label: t('town'), required: true},
          {name: 'country', type: 'string', label: t('country'), required: true}
        ]
      }, {
        id: 'geolocation',
        title: t('geolocation'),
        icon: 'fa fa-fw fa-map-marker',
        fields: [
          {name: 'gps.latitude', type: 'number', label: t('latitude')}, // todo make a field
          {name: 'gps.longitude', type: 'number', label: t('longitude')}
        ]
      }
    ]}
  >
    <FormSections
      level={3}
    >
      <FormSection
        id="location-users"
        icon="fa fa-fw fa-user"
        title={t('users')}
        actions={[
          {
            icon: 'fa fa-fw fa-plus',
            label: t('add_user'),
            action: () => true
          }
        ]}
      >
        <DataListContainer
          name="locations.current.users"
          open={UserList.open}
          fetch={{
            url: ['apiv2_location_list_users', {id: props.location.id}],
            autoload: true
          }}
          delete={{
            url: ['apiv2_location_remove_users', {id: props.location.id}],
          }}
          definition={UserList.definition}
          card={UserList.card}
        />
      </FormSection>

      <FormSection
        id="location-organizations"
        icon="fa fa-fw fa-building"
        title={t('groups')}
        actions={[
          {
            icon: 'fa fa-fw fa-plus',
            label: t('add_organization'),
            action: () => true
          }
        ]}
      >
        <DataListContainer
          name="locations.current.organizations"
          open={OrganizationList.open}
          fetch={{
            url: ['apiv2_location_list_organizations', {id: props.location.id}],
            autoload: true
          }}
          delete={{
            url: ['apiv2_location_remove_organizations', {id: props.location.id}],
          }}
          definition={OrganizationList.definition}
          card={OrganizationList.card}
        />
      </FormSection>
    </FormSections>
  </FormContainer>

export {
  LocationActions,
  Location
}
