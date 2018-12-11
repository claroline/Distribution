import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions'
import {LINK_BUTTON} from '#/main/app/buttons'

import {Badge}  from '#/plugin/open-badge/administration/badges/components/badge'
import {Badges} from '#/plugin/open-badge/administration/badges/components/badges'
import {actions}    from '#/plugin/open-badge/administration/badges/actions'

const BadgeTabActions = () =>
  <PageActions>
    <PageAction
      type={LINK_BUTTON}
      icon="fa fa-plus"
      label={trans('add_badge')}
      target="/badges/form"
      primary={true}
    />
  </PageActions>

const BadgeTabComponent = props =>
  <Routes
    routes={[
      {
        path: '/badges',
        exact: true,
        component: Badges
      }, {
        path: '/badges/form/:id?',
        component: Badge,
        onEnter: (params) => props.openForm(params.id)
      }
    ]}
  />

BadgeTabComponent.propTypes = {
  openForm: T.func.isRequired
}

const BadgeTab = connect(
  null,
  dispatch => ({
    openForm(id = null) {
      dispatch(actions.open('badges.current', id))
    }
  })
)(BadgeTabComponent)

export {
  BadgeTab,
  BadgeTabActions
}
