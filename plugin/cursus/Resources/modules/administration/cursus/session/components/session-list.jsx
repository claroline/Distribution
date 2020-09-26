import {trans} from '#/main/app/intl/translation'

import {SessionCard} from '#/plugin/cursus/administration/cursus/session/data/components/session-card'

const SessionList = {
  definition: [
    {
      name: 'name',
      type: 'string',
      label: trans('name'),
      displayed: true,
      primary: true
    }, {
      name: 'code',
      type: 'string',
      label: trans('code'),
      sortable: false
    }, {
      name: 'location',
      type: 'location',
      label: trans('location'),
      placeholder: trans('online_session', {}, 'cursus'),
      displayed: true
    }, {
      name: 'restrictions.dates[0]',
      alias: 'startDate',
      type: 'date',
      label: trans('start_date'),
      displayed: true
    }, {
      name: 'restrictions.dates[1]',
      alias: 'endDate',
      type: 'date',
      label: trans('end_date'),
      displayed: true
    }, {
      name: 'workspace',
      type: 'workspace',
      label: trans('workspace'),
      sortable: false
    }, {
      name: 'restrictions.users',
      alias: 'maxUsers',
      type: 'number',
      label: trans('max_participants', {}, 'cursus'),
      displayed: true
    }, {
      name: 'meta.default',
      type: 'boolean',
      label: trans('default')
    }, {
      name: 'registration.selfRegistration',
      alias: 'publicRegistration',
      type: 'boolean',
      label: trans('public_registration')
    }, {
      name: 'registration.selfUnregistration',
      alias: 'publicUnregistration',
      type: 'boolean',
      label: trans('public_unregistration')
    }, {
      name: 'registration.validation',
      alias: 'registrationValidation',
      type: 'boolean',
      label: trans('registration_validation', {}, 'cursus')
    }, {
      name: 'registration.userValidation',
      alias: 'userValidation',
      type: 'boolean',
      label: trans('user_validation', {}, 'cursus')
    }, {
      name: 'registration.organizationValidation',
      alias: 'organizationValidation',
      type: 'boolean',
      label: trans('organization_validation', {}, 'cursus')
    }, {
      name: 'meta.order',
      alias: 'order',
      type: 'number',
      label: trans('order'),
      displayable: false,
      filterable: false
    }
  ],
  card: SessionCard
}

export {
  SessionList
}
