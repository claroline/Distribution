import React, {Fragment} from 'react'
import {PropTypes as T} from 'prop-types'
import {schemeCategory20c} from 'd3-scale'

import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router/components/routes'
import {Vertical} from '#/main/app/content/tabs/components/vertical'
import {ListData} from '#/main/app/content/list/containers/data'
import {constants as listConst} from '#/main/app/content/list/constants'
import {MODAL_USERS} from '#/main/core/modals/users'
import {UserCard} from '#/main/core/user/components/card'

import {selectors} from '#/plugin/cursus/tools/trainings/catalog/store/selectors'
import {Course as CourseTypes, Session as SessionTypes} from '#/plugin/cursus/prop-types'
import {constants} from '#/plugin/cursus/constants'

const CourseTutors = (props) =>
  <Fragment>
    <ListData
      name={selectors.STORE_NAME+'.courseTutors'}
      fetch={{
        url: ['apiv2_cursus_session_list_users', {type: constants.TEACHER_TYPE, id: props.activeSession.id}],
        autoload: true
      }}
      delete={{
        url: ['apiv2_cursus_session_remove_users', {type: constants.TEACHER_TYPE, id: props.activeSession.id}],
        label: trans('unregister', {}, 'actions')
      }}
      definition={[
        {
          name: 'user',
          type: 'user',
          label: trans('user'),
          displayed: true
        }, {
          name: 'registrationDate',
          type: 'date',
          label: trans('registration_date', {}, 'cursus'),
          options: {time: true},
          displayed: true
        }
      ]}
      card={(cardProps) => <UserCard {...cardProps} data={cardProps.data.user} />}
      display={{
        current: listConst.DISPLAY_TILES_SM
      }}
    />

    <Button
      className="btn btn-block btn-emphasis component-container"
      type={MODAL_BUTTON}
      label={trans('add_tutors', {}, 'cursus')}
      modal={[MODAL_USERS, {
        selectAction: (selected) => ({
          type: CALLBACK_BUTTON,
          label: trans('register', {}, 'actions'),
          callback: () => props.addTutors(props.activeSession.id, selected)
        })
      }]}
      primary={true}
    />
  </Fragment>

CourseTutors.propTypes = {
  activeSession: T.shape(
    SessionTypes.propTypes
  ),
  addTutors: T.func.isRequired
}

const CourseParticipants = (props) =>
  <Fragment>
    <div className="row" style={{marginTop: '-20px'}}>
      <div className="analytics-card">
        <span className="fa fa-chalkboard-teacher" style={{backgroundColor: schemeCategory20c[1]}} />

        <h1 className="h3">
          <small>{trans('tutors', {}, 'cursus')}</small>
          5
        </h1>
      </div>

      <div className="analytics-card">
        <span className="fa fa-user" style={{backgroundColor: schemeCategory20c[5]}} />

        <h1 className="h3">
          <small>{trans('users')}</small>
          23
        </h1>
      </div>

      <div className="analytics-card">
        <span className="fa fa-user-plus" style={{backgroundColor: schemeCategory20c[9]}} />

        <h1 className="h3">
          <small>{trans('Places disponibles')}</small>
          27
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
              path: '/users',
              exact: true
            }, {
              icon: 'fa fa-fw fa-users',
              title: trans('groups'),
              path: '/groups',
              exact: true
            }, {
              icon: 'fa fa-fw fa-user-plus',
              title: trans('En attente'),
              path: '/pending',
              exact: true
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
                  <CourseTutors
                    activeSession={props.activeSession}
                    addTutors={props.addTutors}
                  />
                )

                return Tutors
              }
            }, {
              path: '/users',
              component: null
            }, {
              path: '/groups',
              component: null
            }, {
              path: '/pending',
              component: null
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
  addTutors: T.func.isRequired,
  invalidateList: T.func.isRequired
}

export {
  CourseParticipants
}
