import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {FormData} from '#/main/app/content/form/containers/data'

import {selectors} from '#/main/app/security/registration/store/selectors'

/**
 * Registration Form : Required section.
 * Contains all fields required for the user registration.
 *
 * @constructor
 */
const Required = () =>
  <FormData
    level={2}
    name={selectors.FORM_NAME}
    sections={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'lastName',
            type: 'string',
            label: trans('last_name'),
            required: true
          }, {
            name: 'firstName',
            type: 'string',
            label: trans('first_name'),
            required: true
          }, {
            name: 'email',
            type: 'email',
            label: trans('email'),
            required: true,
            options: {
              unique: {
                name: 'email',
                check: ['apiv2_user_exist']
              }
            }
          }, {
            name: 'username',
            type: 'username',
            label: trans('username'),
            required: true,
            options: {
              unique: {
                name: 'username',
                check: ['apiv2_user_exist']
              }
            }
          }, {
            name: 'plainPassword',
            type: 'password',
            label: trans('password'),
            required: true
          }
        ]
      }
    ]}
  />

export {
  Required
}
