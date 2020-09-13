import React, {Fragment} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'

import {route} from '#/plugin/cursus/routing'
import {
  Course as CourseTypes,
  Session as SessionTypes
} from '#/plugin/cursus/course/prop-types'
import {MODAL_SESSION_EVENT_FORM} from '#/plugin/cursus/administration/modals/event-form'
import {SessionEventList} from '#/plugin/cursus/administration/cursus/session-event/components/session-event-list'
import {selectors} from '#/plugin/cursus/tools/cursus/catalog/store/selectors'

const CourseEvents = (props) =>
  <Fragment>
    <ListData
      name={selectors.STORE_NAME+'.courseEvents'}
      fetch={{
        url: ['apiv2_cursus_session_list_events', {id: props.activeSession.id}],
        autoload: true
      }}
      primaryAction={(row) => ({
        type: LINK_BUTTON,
        target: route(props.course, row),
        label: trans('open', {}, 'actions')
      })}
      delete={{
        url: ['apiv2_cursus_event_delete_bulk']
      }}
      definition={SessionEventList.definition}
      card={SessionEventList.card}
      actions={(rows) => [
        {
          name: 'edit',
          type: MODAL_BUTTON,
          icon: 'fa fa-fw fa-pencil',
          label: trans('edit', {}, 'actions'),
          modal: [MODAL_SESSION_EVENT_FORM, {
            event: rows[0],
            onSave: () => props.invalidateList()
          }],
          scope: ['object'],
          group: trans('management')
        }
      ]}
    />

    <Button
      className="btn btn-block btn-emphasis component-container"
      type={MODAL_BUTTON}
      label={trans('add_event', {}, 'cursus')}
      modal={[MODAL_SESSION_EVENT_FORM, {
        session: props.activeSession,
        onSave: () => props.reload(props.course.slug)
      }]}
      primary={true}
    />
  </Fragment>

CourseEvents.propTypes = {
  path: T.string.isRequired,
  course: T.shape(
    CourseTypes.propTypes
  ).isRequired,
  activeSession: T.shape(
    SessionTypes.propTypes
  ).isRequired,
  reload: T.func.isRequired,
  invalidateList: T.func.isRequired
}

export {
  CourseEvents
}
