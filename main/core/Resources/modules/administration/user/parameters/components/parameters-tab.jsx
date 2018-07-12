import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {url} from '#/main/app/api'

import {PageActions} from '#/main/core/layout/page/components/page-actions.jsx'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'
import {FormPageActionsContainer} from '#/main/core/data/form/containers/page-actions.jsx'
import {select as formSelect} from '#/main/core/data/form/selectors'

import {constants} from '#/main/core/administration/user/parameters/constants'

const Parameters = (props) => {
  const roleEnum = {}
  props.platformRoles.forEach(role => {
    roleEnum[role.name] = trans(role.translationKey)
  })

  return (
    <FormContainer
      level={3}
      name="parameters"
      target={['apiv2_user_parameters_update']}
      buttons={true}
      sections={[
        {
          icon: 'fa fa-fw fa-user-plus',
          title: trans('registration'),
          defaultOpened: true,
          fields: [
            // todo auto_logging
            // todo self unregistration
            {
              name: 'registration.url',
              type: 'url',
              label: trans('registration_url'),
              calculated: () => url(['claro_user_registration', {}, true]),
              required: true,
              disabled: true
            }, {
              name: 'registration.self',
              type: 'boolean',
              label: trans('activate_self_registration'),
              help: trans('self_registration_platform_help'),
              linked: [
                {
                  name: 'registration.register_button_at_login',
                  type: 'boolean',
                  label: trans('show_register_button_in_login_page'),
                  displayed: props.parameters.registration && props.parameters.registration.self
                }, {
                  name: 'registration.force_organization_creation',
                  type: 'boolean',
                  label: trans('force_organization_creation'),
                  displayed: props.parameters.registration && props.parameters.registration.self
                }, {
                  name: 'registration.allow_workspace',
                  type: 'boolean',
                  label: trans('allow_workspace_registration'),
                  displayed: props.parameters.registration && props.parameters.registration.self
                }
              ]
            }, {
              name: 'registration.default_role',
              type: 'choice',
              label: trans('default_role'),
              required: true,
              options: {
                noEmpty: true,
                condensed: true,
                choices: roleEnum
              }
            }, {
              name: 'locales.default',
              type: 'locale',
              label: trans('default_language'),
              required: true,
              options: {
                onlyEnabled: true
              }
            }, {
              name: 'registration.validation',
              type: 'choice',
              label: trans('registration_mail_validation'),
              required: true,
              options: {
                noEmpty: true,
                condensed: true,
                choices: constants.registrationValidationTypes
              }
            }
          ]
        }, {
          icon: 'fa fa-fw fa-sign-in',
          title: trans('login'),
          fields: [
            // redirect
            {
              name: 'security.cookie_lifetime',
              type: 'number',
              label: trans('cookie_lifetime'),
              options: {
                min: 0,
                unit: trans('days')
              }
            }
          ]
        }, {
          id: 'profile',
          icon: 'fa fa-fw fa-id-card-o',
          title: trans('user_profile'),
          fields: [
            {
              name: 'profile.roles_edition',
              type: 'choice',
              label: trans('profile_roles_for_edition'),
              options: {
                multiple: true,
                condensed: true,
                choices: Object.keys(roleEnum).filter(r => ['ROLE_ADMIN', 'ROLE_ANONYMOUS'].indexOf(r) === -1).reduce((choices, key) => {
                  choices[key] = roleEnum[key]

                  return choices
                }, {})
              }
            }, {
              name: 'profile.roles_confidential',
              type: 'choice',
              label: trans('profile_roles_for_confidential_fields'),
              options: {
                multiple: true,
                condensed: true,
                choices: Object.keys(roleEnum).filter(r => r !== 'ROLE_ADMIN').reduce((choices, key) => {
                  choices[key] = roleEnum[key]

                  return choices
                }, {})
              }
            }, {
              name: 'profile.roles_locked',
              type: 'choice',
              label: trans('profile_roles_for_locked_fields'),
              options: {
                multiple: true,
                condensed: true,
                choices: Object.keys(roleEnum).filter(r => ['ROLE_ADMIN', 'ROLE_ANONYMOUS'].indexOf(r) === -1).reduce((choices, key) => {
                  choices[key] = roleEnum[key]

                  return choices
                }, {})
              }
            }
          ]
        }, {
          id: 'anonymous',
          icon: 'fa fa-fw fa-user-secret',
          title: trans('anonymous_users'),
          fields: [
            {
              name: 'security.form_captcha',
              type: 'boolean',
              label: trans('display_captcha')
            }, {
              name: 'security.form_honeypot',
              type: 'boolean',
              label: trans('use_honeypot')
            }, {
              name: 'security.anonymous_public_profile',
              type: 'boolean',
              label: trans('show_profile_for_anonymous')
            }
          ]
        }, {
          icon: 'fa fa-fw fa-copyright',
          title: trans('term_of_service'),
          fields: [
            {
              name: 'tos.enabled',
              type: 'boolean',
              label: trans('term_of_service_activation_message'),
              help: trans('term_of_service_activation_help'),
              linked: [
                {
                  name: 'tos.text',
                  type: 'translated',
                  label: trans('term_of_service'),
                  displayed: props.parameters.tos.enabled
                }
              ]
            }
          ]
        }
      ]}
    />
  )
}

Parameters.propTypes = {
  platformRoles: T.array.isRequired,
  parameters: T.shape({
    registration: T.shape({
      self: T.bool
    }),
    tos: T.shape({
      enabled: T.bool.isRequired
    }).isRequired
  }).isRequired
}

const ParametersTab = connect(
  (state) => ({
    parameters: formSelect.data(formSelect.form(state, 'parameters')),
    platformRoles: state.platformRoles
  })
)(Parameters)

export {
  ParametersTab
}
