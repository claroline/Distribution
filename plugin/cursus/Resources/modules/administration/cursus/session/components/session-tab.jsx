import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {Routes} from '#/main/app/router'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions'
import {LINK_BUTTON} from '#/main/app/buttons'

import {Sessions} from '#/plugin/cursus/administration/cursus/session/components/sessions'
import {Session} from '#/plugin/cursus/administration/cursus/session/components/session'
import {actions} from '#/plugin/cursus/administration/cursus/session/actions'

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

const SessionTabComponent = props =>
  <Routes
    routes={[
      {
        path: '/sessions',
        exact: true,
        component: Sessions
      }, {
        path: '/sessions/form/:id?',
        component: Session,
        // onEnter: (params) => props.openForm(params.id || null)
      }
    ]}
  />

SessionTabComponent.propTypes = {
  openForm: T.func.isRequired
}

const SessionTab = connect(
  null,
  // dispatch => ({
  //   openForm(id = null) {
  //     dispatch(actions.open('sessions.current', id))
  //   }
  // })
)(SessionTabComponent)

export {
  SessionTabActions,
  SessionTab
}
