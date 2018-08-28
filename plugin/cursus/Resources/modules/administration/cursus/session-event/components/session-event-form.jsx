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
import {SessionEvent as SessionEventType} from '#/plugin/cursus/administration/cursus/prop-types'
import {actions} from '#/plugin/cursus/administration/cursus/session-event/store'

const SessionEventFormComponent = (props) => props.sessionEvent && props.sessionEvent.meta && props.sessionEvent.meta.session ?
  <FormData
    level={3}
    name="events.current"
    buttons={true}
    target={(sessionEvent, isNew) => isNew ?
      ['apiv2_cursus_session_event_create'] :
      ['apiv2_cursus_session_event_update', {id: sessionEvent.id}]
    }
    cancel={{
      type: LINK_BUTTON,
      target: '/events',
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
            name: 'meta.set',
            type: 'string',
            label: trans('session_event_set', {}, 'cursus')
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
    {/*<FormSections level={3}>*/}
      {/*<FormSection*/}
        {/*className="embedded-list-section"*/}
        {/*icon="fa fa-fw fa-clock-o"*/}
        {/*title={trans('session_events', {}, 'cursus')}*/}
        {/*disabled={props.new}*/}
        {/*actions={[*/}
          {/*{*/}
            {/*type: CALLBACK_BUTTON,*/}
            {/*icon: 'fa fa-fw fa-plus',*/}
            {/*label: trans('create_session_event'),*/}
            {/*callback: () => console.log(props.session)*/}
          {/*}*/}
        {/*]}*/}
      {/*>*/}
        {/*<ListData*/}
          {/*name="sessions.current.events"*/}
          {/*fetch={{*/}
            {/*url: ['apiv2_cursus_session_list_events', {id: props.session.id}],*/}
            {/*autoload: props.session.id && !props.new*/}
          {/*}}*/}
          {/*primaryAction={SessionEventList.open}*/}
          {/*delete={{*/}
            {/*url: ['apiv2_cursus_session_event_delete_bulk']*/}
          {/*}}*/}
          {/*definition={SessionEventList.definition}*/}
          {/*card={SessionEventList.card}*/}
        {/*/>*/}
      {/*</FormSection>*/}
    {/*</FormSections>*/}
  </FormData> :
  <div className="alert alert-danger">
    {trans('session_event_creation_impossible_no_session', {}, 'cursus')}
  </div>

SessionEventFormComponent.propTypes = {
  new: T.bool.isRequired,
  sessionEvent: T.shape(SessionEventType.propTypes).isRequired
}

const SessionEventForm = connect(
  state => ({
    new: formSelect.isNew(formSelect.form(state, 'events.current')),
    sessionEvent: formSelect.data(formSelect.form(state, 'events.current'))
  })
)(SessionEventFormComponent)

export {
  SessionEventForm
}
