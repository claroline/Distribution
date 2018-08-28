import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {selectors as formSelect} from '#/main/app/content/form/store/selectors'
import {CALLBACK_BUTTON, LINK_BUTTON} from '#/main/app/buttons'
import {MODAL_DATA_LIST} from '#/main/app/modals/list'
import {FormData} from '#/main/app/content/form/containers/data'
import {ListData} from '#/main/app/content/list/containers/data'

import {trans} from '#/main/core/translation'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections'

import {constants} from '#/plugin/cursus/administration/cursus/constants'
import {Session as SessionType} from '#/plugin/cursus/administration/cursus/prop-types'
import {actions} from '#/plugin/cursus/administration/cursus/session/store'
import {SessionEventList} from '#/plugin/cursus/administration/cursus/session-event/components/session-event-list'

const SessionFormComponent = (props) => props.session && props.session.meta && props.session.meta.course ?
  <FormData
    level={3}
    name="sessions.current"
    buttons={true}
    target={(session, isNew) => isNew ?
      ['apiv2_cursus_session_create'] :
      ['apiv2_cursus_session_update', {id: session.id}]
    }
    cancel={{
      type: LINK_BUTTON,
      target: '/sessions',
      exact: true
    }}
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
            name: 'meta.defaultSession',
            type: 'boolean',
            label: trans('default_session', {}, 'cursus'),
            required: true
          }, {
            name: 'meta.order',
            type: 'number',
            label: trans('order'),
            required: true,
            options: {
              min: 0
            }
          }, {
            name: 'meta.color',
            type: 'color',
            label: trans('color')
          }
        ]
      }, {
        icon: 'fa fa-fw fa-sign-in',
        title: trans('registration'),
        fields: [
          {
            name: 'registration.publicRegistration',
            type: 'boolean',
            label: trans('public_registration'),
            required: true
          }, {
            name: 'registration.publicUnregistration',
            type: 'boolean',
            label: trans('public_unregistration'),
            required: true
          }, {
            name: 'registration.registrationValidation',
            type: 'boolean',
            label: trans('registration_validation', {}, 'cursus'),
            required: true
          }, {
            name: 'registration.userValidation',
            type: 'boolean',
            label: trans('user_validation', {}, 'cursus'),
            required: true
          }, {
            name: 'registration.organizationValidation',
            type: 'boolean',
            label: trans('organization_validation', {}, 'cursus'),
            required: true
          }, {
            name: 'registration.eventRegistrationType',
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
            name: 'restrictions.maxUsers',
            type: 'number',
            label: trans('maxUsers'),
            options: {
              min: 0
            }
          }
        ]
      }
    ]}
  >
    <FormSections level={3}>
      <FormSection
        className="embedded-list-section"
        icon="fa fa-fw fa-clock-o"
        title={trans('session_events', {}, 'cursus')}
        disabled={props.new}
        actions={[
          {
            type: CALLBACK_BUTTON,
            icon: 'fa fa-fw fa-plus',
            label: trans('create_session_event', {}, 'cursus'),
            callback: () => console.log(props.session)
          }
        ]}
      >
        <ListData
          name="sessions.current.events"
          fetch={{
            url: ['apiv2_cursus_session_list_events', {id: props.session.id}],
            autoload: props.session.id && !props.new
          }}
          primaryAction={SessionEventList.open}
          delete={{
            url: ['apiv2_cursus_session_event_delete_bulk']
          }}
          definition={SessionEventList.definition}
          card={SessionEventList.card}
        />
      </FormSection>
    </FormSections>
  </FormData> :
  <div className="alert alert-danger">
    {trans('session_creation_impossible_no_course', {}, 'cursus')}
  </div>

SessionFormComponent.propTypes = {
  new: T.bool.isRequired,
  session: T.shape(SessionType.propTypes).isRequired
}

const SessionForm = connect(
  state => ({
    new: formSelect.isNew(formSelect.form(state, 'sessions.current')),
    session: formSelect.data(formSelect.form(state, 'sessions.current'))
  })
)(SessionFormComponent)

export {
  SessionForm
}
