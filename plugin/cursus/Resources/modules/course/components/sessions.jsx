import React, {Fragment} from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {MODAL_BUTTON} from '#/main/app/buttons'

import {Course as CourseTypes} from '#/plugin/cursus/prop-types'
import {MODAL_SESSION_FORM} from '#/plugin/cursus/session/modals/parameters'
import {SessionList} from '#/plugin/cursus/session/components/list'
import {selectors} from '#/plugin/cursus/tools/trainings/catalog/store/selectors'

const CourseSessions = (props) =>
  <Fragment>
    <SessionList
      name={selectors.STORE_NAME+'.courseSessions'}
      url={['apiv2_cursus_course_list_sessions', {id: props.course.id}]}
      invalidate={() => props.reload(props.course.slug)}
    />

    <Button
      className="btn btn-block btn-emphasis component-container"
      type={MODAL_BUTTON}
      label={trans('add_session', {}, 'cursus')}
      modal={[MODAL_SESSION_FORM, {
        course: props.course,
        onSave: () => props.reload(props.course.slug)
      }]}
      primary={true}
    />
  </Fragment>

CourseSessions.propTypes = {
  path: T.string.isRequired,
  course: T.shape(
    CourseTypes.propTypes
  ).isRequired,
  reload: T.func.isRequired
}

export {
  CourseSessions
}
