import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {Routes} from '#/main/app/router'
import {actions as modalActions} from '#/main/app/overlay/modal/store'
import {MODAL_DATA_LIST} from '#/main/app/modals/list'
import {LINK_BUTTON} from '#/main/app/buttons'

import {trans} from '#/main/core/translation'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions'

import {Sessions} from '#/plugin/cursus/administration/cursus/session/components/sessions'
import {SessionForm} from '#/plugin/cursus/administration/cursus/session/components/session-form'
import {actions} from '#/plugin/cursus/administration/cursus/session/store'

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
        component: SessionForm,
        // onEnter: (params) => props.openForm(params.id || null)
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
        // dispatch(modalActions.showModal(MODAL_DATA_LIST, {
        //   icon: 'fa fa-fw fa-user',
        //   title: trans('register_users'),
        //   subtitle: trans('workspace_register_select_users'),
        //   confirmText: trans('select', {}, 'actions'),
        //   name: 'users.picker',
        //   definition: UserList.definition,
        //   card: UserList.card,
        //   fetch: {
        //     url: ['apiv2_user_list_registerable'],
        //     autoload: true
        //   },
        //   handleSelect: (users) => {
        //     dispatch(modalActions.showModal(MODAL_DATA_LIST, getModalDefinition(
        //       'fa fa-fw fa-user',
        //       trans('register_users'),
        //       workspace,
        //       (roles) => roles.forEach(role => dispatch(actions.addUsersToRole(role, users)))
        //     )))
        //   }
        // }))
      }
    }
  })
)(SessionTabComponent)

export {
  SessionTabActions,
  SessionTab
}
