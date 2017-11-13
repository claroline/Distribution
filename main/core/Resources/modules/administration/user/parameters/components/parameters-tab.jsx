import React from 'react'

import {t} from '#/main/core/translation'

import {select} from '#/main/core/layout/form/selectors'

import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions.jsx'
import {makeSaveAction} from '#/main/core/layout/form/containers/form-save.jsx'
import {FormContainer as Form} from '#/main/core/layout/form/containers/form.jsx'

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
          {
            name: 'registration.auto',
            type: 'boolean',
            label: t('activate_self_registration')
          }, { // todo should be hidden if registration.auto === false
            name: 'registration.showOnLogin',
            type: 'boolean',
            label: t('show_register_button_in_login_page')
          }, {
            name: 'registration.defaultRole',
            type: 'enum',
            label: t('default_role'),
            options: {
              noEmpty: true,
              choices: {} // roles
            }
          }, {
            name: 'registration.defaultLang',
            type: 'locale', // todo should be a semantic type
            label: t('default_language'),
            options: {
              onlyEnabled: true
            }
          }, {
            name: 'registration.validation',
            type: 'enum',
            label: t('registration_mail_validation'),
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
            name: 'cookieLifetime',
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
            name: 'anonymous.captcha',
            type: 'boolean',
            label: t('display_captcha')
          }, {
            name: 'anonymous.emailHoneypot',
            type: 'boolean',
            label: t('use_honeypot')
          }, {
            name: 'anonymous.profileAccess',
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
            name: 'termsOfService.enabled',
            type: 'boolean',
            label: t('term_of_service_activation_message'),
            help: t('term_of_service_activation_help'),
          }, { // todo should be hidden if not enabled
            name: 'termsOfService.content',
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
