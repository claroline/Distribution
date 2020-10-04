import React, {Fragment} from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import {schemeCategory20c} from 'd3-scale'

import {trans} from '#/main/app/intl/translation'
import {hasPermission} from '#/main/app/security'
import {LinkButton} from '#/main/app/buttons/link'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {AlertBlock} from '#/main/app/alert/components/alert-block'
import {Routes} from '#/main/app/router/components/routes'
import {Vertical} from '#/main/app/content/tabs/components/vertical'
import {MODAL_USERS} from '#/main/core/modals/users'
import {MODAL_GROUPS} from '#/main/core/modals/groups'

import {selectors} from '#/plugin/cursus/tools/trainings/catalog/store/selectors'
import {Course as CourseTypes, Session as SessionTypes} from '#/plugin/cursus/prop-types'
import {constants} from '#/plugin/cursus/constants'

import {SessionGroups} from '#/plugin/cursus/session/components/groups'
import {SessionUsers} from '#/plugin/cursus/session/components/users'

const CourseUsers = (props) =>
  <SessionUsers
    session={props.activeSession}
    name={props.name}
    url={['apiv2_cursus_session_list_users', {type: props.type, id: props.activeSession.id}]}
    unregisterUrl={['apiv2_cursus_session_remove_users', {type: props.type, id: props.activeSession.id}]}
    add={{
      name: 'add_users',
      type: MODAL_BUTTON,
      label: constants.TEACHER_TYPE === props.type ? trans('add_tutors', {}, 'cursus') : trans('add_users'),
      modal: [MODAL_USERS, {
        selectAction: (selected) => ({
          type: CALLBACK_BUTTON,
          label: trans('register', {}, 'actions'),
          callback: () => props.addUsers(props.activeSession.id, selected, props.type)
        })
      }]
    }}
  />

CourseUsers.propTypes = {
  name: T.string.isRequired,
  type: T.string.isRequired,
  activeSession: T.shape(
    SessionTypes.propTypes
  ),
  addUsers: T.func.isRequired
}

const CourseGroups = (props) =>
  <SessionGroups
    session={props.activeSession}
    name={props.name}
    url={['apiv2_cursus_session_list_groups', {type: props.type, id: props.activeSession.id}]}
    unregisterUrl={['apiv2_cursus_session_remove_groups', {type: props.type, id: props.activeSession.id}]}
    add={{
      name: 'add_groups',
      type: MODAL_BUTTON,
      label: trans('add_groups'),
      modal: [MODAL_GROUPS, {
        selectAction: (selected) => ({
          type: CALLBACK_BUTTON,
          label: trans('register', {}, 'actions'),
          callback: () => props.addGroups(props.activeSession.id, selected, props.type)
        })
      }]
    }}
  />

CourseGroups.propTypes = {
  name: T.string.isRequired,
  type: T.string.isRequired,
  activeSession: T.shape(
    SessionTypes.propTypes
  ),
  addGroups: T.func.isRequired
}

const CourseParticipants = (props) =>
  <Fragment>
    <div className="row" style={{marginTop: '-20px'}}>
      <div className="analytics-card">
        <span className="fa fa-chalkboard-teacher" style={{backgroundColor: schemeCategory20c[1]}} />

        <h1 className="h3">
          <small>{trans('tutors', {}, 'cursus')}</small>
          {get(props.activeSession, 'participants.tutors', 0)}
        </h1>
      </div>

      <div className="analytics-card">
        <span className="fa fa-user" style={{backgroundColor: schemeCategory20c[5]}} />

        <h1 className="h3">
          <small>{trans('users')}</small>
          {get(props.activeSession, 'participants.learners', 0)}
        </h1>
      </div>

      {hasPermission('edit', props.activeSession) &&
        <div className="analytics-card">
          <span className="fa fa-hourglass-half" style={{backgroundColor: schemeCategory20c[9]}} />

          <h1 className="h3">
            <small>{trans('En attente')}</small>
            {get(props.activeSession, 'participants.pending', 0)}
          </h1>
        </div>
      }

      <div className="analytics-card">
        <span className="fa fa-user-plus" style={{backgroundColor: schemeCategory20c[13]}} />

        <h1 className="h3">
          <small>{trans('available_seats', {}, 'cursus')}</small>
          {get(props.activeSession, 'restrictions.users') ?
            (get(props.activeSession, 'restrictions.users') - get(props.activeSession, 'participants.learners', 0)) + ' / ' + get(props.activeSession, 'restrictions.users')
            : <span className="fa fa-fw fa-infinity" />
          }
        </h1>
      </div>
    </div>

    <div className="row">
      <div className="col-md-3">
        <Vertical
          basePath={props.path+'/'+props.course.slug+(props.activeSession ? '/'+props.activeSession.id : '')+'/participants'}
          tabs={[
            {
              icon: 'fa fa-fw fa-chalkboard-teacher',
              title: trans('tutors', {}, 'cursus'),
              path: '/',
              exact: true
            }, {
              icon: 'fa fa-fw fa-user',
              title: trans('users'),
              path: '/users'
            }, {
              icon: 'fa fa-fw fa-users',
              title: trans('groups'),
              path: '/groups'
            }, {
              icon: 'fa fa-fw fa-hourglass-half',
              title: trans('En attente'),
              path: '/pending',
              displayed: hasPermission('edit', props.activeSession)
            }
          ]}
        />
      </div>

      <div className="col-md-9">
        <Routes
          path={props.path+'/'+props.course.slug+(props.activeSession ? '/'+props.activeSession.id : '')+'/participants'}
          routes={[
            {
              path: '/',
              exact: true,
              render() {
                const Tutors = (
                  <CourseUsers
                    type={constants.TEACHER_TYPE}
                    activeSession={props.activeSession}
                    name={selectors.STORE_NAME+'.courseTutors'}
                    addUsers={props.addUsers}
                  />
                )

                return Tutors
              }
            }, {
              path: '/users',
              render() {
                const Users = (
                  <Fragment>
                    {get(props.activeSession, 'registration.userValidation') &&
                      <AlertBlock title={trans('registration_user_confirmation_title', {}, 'cursus')}>
                        {trans('registration_user_confirmation_pending_help', {}, 'cursus')}
                        <br/>
                        {trans('registration_user_confirmation_manager_help', {}, 'cursus')}
                        (<LinkButton target={props.path+'/'+props.course.slug+(props.activeSession ? '/'+props.activeSession.id : '')+'/participants/pending'}>{trans('show_pending_list', {}, 'cursus')}</LinkButton>)
                      </AlertBlock>
                    }

                    <CourseUsers
                      type={constants.LEARNER_TYPE}
                      activeSession={props.activeSession}
                      name={selectors.STORE_NAME+'.courseUsers'}
                      addUsers={props.addUsers}
                    />
                  </Fragment>
                )

                return Users
              }
            }, {
              path: '/groups',
              render() {
                const Groups = (
                  <CourseGroups
                    type={constants.LEARNER_TYPE}
                    activeSession={props.activeSession}
                    name={selectors.STORE_NAME+'.courseGroups'}
                    addGroups={props.addGroups}
                  />
                )

                return Groups
              }
            }, {
              path: '/pending',
              disabled: !hasPermission('edit', props.activeSession),
              render() {
                const Pending = (
                  <SessionUsers
                    session={props.activeSession}
                    name={selectors.STORE_NAME+'.coursePending'}
                    url={['apiv2_cursus_session_list_pending', {id: props.activeSession.id}]}
                    unregisterUrl={['apiv2_cursus_session_remove_users', {type: constants.LEARNER_TYPE, id: props.activeSession.id}]}
                    actions={(rows) => [
                      {
                        name: 'confirm',
                        type: CALLBACK_BUTTON,
                        icon: 'fa fa-fw fa-user-check',
                        label: trans('Confirmer l\'inscription', {}, 'cursus'),
                        callback: () => props.confirmPending(props.activeSession.id, rows),
                        displayed: hasPermission('edit', props.activeSession) && get (props.activeSession, 'registration.userValidation') && -1 !== rows.findIndex(row => !row.confirmed)
                      }, {
                        name: 'validate',
                        type: CALLBACK_BUTTON,
                        icon: 'fa fa-fw fa-check',
                        label: trans('Valider l\'inscription', {}, 'cursus'),
                        callback: () => props.validatePending(props.activeSession.id, rows),
                        displayed: hasPermission('edit', props.activeSession) && -1 !== rows.findIndex(row => !row.validated)
                      }
                    ]}
                    add={{
                      name: 'add_users',
                      type: MODAL_BUTTON,
                      label: trans('add_pending', {}, 'cursus'),
                      modal: [MODAL_USERS, {
                        selectAction: (selected) => ({
                          type: CALLBACK_BUTTON,
                          label: trans('register', {}, 'actions'),
                          callback: () => props.addPending(props.activeSession.id, selected)
                        })
                      }]
                    }}
                  />
                )

                return Pending
              }
            }
          ]}
        />
      </div>
    </div>
  </Fragment>

CourseParticipants.propTypes = {
  path: T.string.isRequired,
  course: T.shape(
    CourseTypes.propTypes
  ).isRequired,
  activeSession: T.shape(
    SessionTypes.propTypes
  ),
  addUsers: T.func.isRequired,
  addGroups: T.func.isRequired,
  addPending: T.func.isRequired,
  confirmPending: T.func.isRequired,
  validatePending: T.func.isRequired
}

export {
  CourseParticipants
}
