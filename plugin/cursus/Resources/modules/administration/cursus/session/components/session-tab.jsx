import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'
import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {Routes} from '#/main/app/router'
import {LINK_BUTTON} from '#/main/app/buttons'
import {actions as modalActions} from '#/main/app/overlay/modal/store'
import {MODAL_DATA_LIST} from '#/main/app/modals/list'

import {trans} from '#/main/core/translation'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions'

import {actions} from '#/plugin/cursus/administration/cursus/session/store'
import {Session as SessionType} from '#/plugin/cursus/administration/cursus/prop-types'
import {CourseList} from '#/plugin/cursus/administration/cursus/course/components/course-list'
import {Sessions} from '#/plugin/cursus/administration/cursus/session/components/sessions'
import {SessionForm} from '#/plugin/cursus/administration/cursus/session/components/session-form'

const SessionTabActions = () =>
  <PageActions>
    <PageAction
      type={LINK_BUTTON}
      icon="fa fa-plus"
      label={trans('create_session', {}, 'cursus')}
      target="/sessions/form"
      primary={true}
    />
  </PageActions>

const SessionTabComponent = (props) =>
  <Routes
    routes={[
      {
        path: '/sessions',
        exact: true,
        component: Sessions
      }, {
        path: '/sessions/form/:id?',
        component: SessionForm,
        onEnter: (params) => props.openForm(params.id),
        onLeave: () => props.resetForm()
      }
    ]}
  />

SessionTabComponent.propTypes = {
  openForm: T.func.isRequired
}

const SessionTab = connect(
  null,
  dispatch => ({
    openForm(id = null) {
      if (id) {
        dispatch(actions.open('sessions.current', {}, id))
      } else {
        dispatch(modalActions.showModal(MODAL_DATA_LIST, {
          icon: 'fa fa-fw fa-tasks',
          title: trans('select_course_for_session_creation', {}, 'cursus'),
          confirmText: trans('select', {}, 'actions'),
          name: 'courses.picker',
          definition: CourseList.definition,
          card: CourseList.card,
          fetch: {
            url: ['apiv2_cursus_course_list'],
            autoload: true
          },
          handleSelect: (selected) => {
            const defaultProps = cloneDeep(SessionType.defaultProps)
            set(defaultProps, 'meta.course.id', selected[0])
            dispatch(actions.open('sessions.current', defaultProps))
          }
        }))
      }
    },
    resetForm() {
      dispatch(actions.reset('sessions.current'))
    }
  })
)(SessionTabComponent)

export {
  SessionTabActions,
  SessionTab
}
