import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {FormData} from '#/main/app/content/form/containers/data'

import {constants} from '#/plugin/cursus/administration/cursus/constants'

const SessionEventForm = (props) =>
  <FormData
    {...props}
    sections={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'name',
            type: 'string',
            label: trans('name'),
            required: true
          }, {
            name: 'code',
            type: 'string',
            label: trans('code'),
            required: true
          }, {
            name: 'description',
            type: 'html',
            label: trans('description')
          }
        ]
      }, {
        icon: 'fa fa-fw fa-cogs',
        title: trans('parameters'),
        fields: [
          {
            name: 'meta.location',
            type: 'location',
            label: trans('location')
          }, {
            name: 'meta.locationExtra',
            type: 'html',
            label: trans('extra_informations', {}, 'cursus')
          }, {
            name: 'meta.set',
            type: 'string',
            label: trans('session_event_set', {}, 'cursus')
          }, {
            name: 'meta.isEvent',
            type: 'boolean',
            label: trans('show_in_agenda', {}, 'cursus')
          }
        ]
      }, {
        icon: 'fa fa-fw fa-sign-in',
        title: trans('registration'),
        fields: [
          {
            name: 'registration.registrationType',
            type: 'choice',
            label: trans('session_event_registration', {}, 'cursus'),
            required: true,
            options: {
              multiple: false,
              choices: constants.REGISTRATION_TYPES
            }
          }
        ]
      }, {
        icon: 'fa fa-fw fa-key',
        title: trans('restrictions'),
        fields: [
          {
            name: 'restrictions.dates',
            type: 'date-range',
            label: trans('access_dates'),
            required: true,
            options: {
              time: true
            }
          }, {
            name: 'restrictions.users',
            type: 'number',
            label: trans('users_count'),
            options: {
              min: 0
            },
            displayed: (event) => event.registration && constants.REGISTRATION_AUTO !== event.registration.registrationType
          }
        ]
      }
    ]}
  >
    {props.children}
  </FormData>

SessionEventForm.propTypes = {
  name: T.string.isRequired,
  children: T.any
}

export {
  SessionEventForm
}
