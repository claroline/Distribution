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
import {SessionEventForm} from '#/plugin/cursus/administration/cursus/session-event/components/form'

const SessionEventComponent = (props) => props.sessionEvent && props.sessionEvent.meta && props.sessionEvent.meta.session ?
  <SessionEventForm
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
  </SessionEventForm> :
  <div className="alert alert-danger">
    {trans('session_event_creation_impossible_no_session', {}, 'cursus')}
  </div>

SessionEventComponent.propTypes = {
  new: T.bool.isRequired,
  sessionEvent: T.shape(SessionEventType.propTypes).isRequired
}

const SessionEvent = connect(
  state => ({
    new: formSelect.isNew(formSelect.form(state, 'events.current')),
    sessionEvent: formSelect.data(formSelect.form(state, 'events.current'))
  })
)(SessionEventComponent)

export {
  SessionEvent
}
