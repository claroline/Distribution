import React from 'react'

import {t} from '#/main/core/translation'

import {select} from '#/main/core/data/form/selectors'

import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {makeSaveAction} from '#/main/core/data/form/containers/form-save.jsx'
import {FormContainer as Form} from '#/main/core/data/form/containers/form.jsx'
import {generateUrl} from '#/main/core/fos-js-router'

/*
var yolo = fetch(
  generateUrl('apiv2_role_list') + '?filters[type]=platform',
  {method: 'GET', credentials: 'include'}
).then(response => response.json())
.then(json => json.data.reduce((o, key) => Object.assign(o, {['translationKey']: o.translationKey}, {})))

setTimeout(function(){console.log(yolo)}, 2000);

console.log(yolo)
*/

import {
  REGISTRATION_MAIL_VALIDATION_NONE,
  REGISTRATION_MAIL_VALIDATION_FULL,
  REGISTRATION_MAIL_VALIDATION_PARTIAL
} from '#/main/core/administration/user/parameters/constants'

const ParametersSaveAction = makeSaveAction('parameters', formData => ({
  update: ['apiv2_user_parameters_update']
}))(PageAction)

const ParametersTabActions = () =>
  <PageActions>
    <ParametersSaveAction />
  </PageActions>

const ParametersTab = () =>
  <Form
    level={3}
    name="parameters"
    sections={[
      {
        id: 'registration',
        icon: 'fa fa-fw fa-user-plus',
        title: t('registration'),
        defaultOpened: true,
        fields: [
          // auto_logging
          {
            name: 'registration.self',
            type: 'boolean',
            label: t('activate_self_registration')
          }, { // todo should be hidden if registration.auto === false
            name: 'registration.register_button_at_login',
            type: 'boolean',
            label: t('show_register_button_in_login_page')
          }, {
            name: 'registration.default_role',
            type: 'enum',
            label: t('default_role'),
            required: true,
            options: {
              noEmpty: true,
              choices: {}
            }
          }, {
            name: 'locales.default',
            type: 'locale',
            label: t('default_language'),
            required: true,
            options: {
              onlyEnabled: true
            }
          }, {
            name: 'registration.validation',
            type: 'enum',
            label: t('registration_mail_validation'),
            required: true,
            options: {
              noEmpty: true,
              choices: {
                [REGISTRATION_MAIL_VALIDATION_NONE]: t('none'),
                [REGISTRATION_MAIL_VALIDATION_FULL]: t('force_mail_validation'),
                [REGISTRATION_MAIL_VALIDATION_PARTIAL]: t('send_mail_info')
              }
            }
          }
        ]
      }, {
        id: 'login',
        icon: 'fa fa-fw fa-sign-in',
        title: t('login'),
        fields: [
          // redirect
          {
            name: 'security.cookie_lifetime',
            type: 'number',
            label: t('cookie_lifetime'),
            options: {
              min: 0,
              unit: t('days')
            }
          }
        ]
      }, {
        id: 'anonymous',
        icon: 'fa fa-fw fa-user-secret',
        title: t('anonymous_users'),
        fields: [
          {
            name: 'security.form_captcha',
            type: 'boolean',
            label: t('display_captcha')
          }, {
            name: 'security.form_honeypot',
            type: 'boolean',
            label: t('use_honeypot')
          }, {
            name: 'security.anonymous_public_profile',
            type: 'boolean',
            label: t('show_profile_for_anonymous')
          }
        ]
      }, {
        id: 'term_of_services',
        icon: 'fa fa-fw fa-copyright',
        title: t('term_of_service'),
        fields: [
          {
            name: 'tos.enabled',
            type: 'boolean',
            label: t('term_of_service_activation_message'),
            help: t('term_of_service_activation_help'),
          }, { // todo should be hidden if not enabled
            name: 'tos.content',
            type: 'html', // todo : create a new localized content type
            label: t('term_of_service')
          }
        ]
      }
    ]}
  />

export {
  ParametersTabActions,
  ParametersTab
}
