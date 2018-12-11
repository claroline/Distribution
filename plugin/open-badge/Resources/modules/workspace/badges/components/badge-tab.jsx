import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions'
import {LINK_BUTTON} from '#/main/app/buttons'

import {Badges} from '#/plugin/open-badge/workspace/badges/components/badges'
import {Badge}  from '#/plugin/open-badge/workspace/badges/components/badge'
import {actions}    from '#/plugin/open-badge/badge/actions'
import {Assertion} from '#/plugin/open-badge/badge/assertion-page'

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
        onEnter: (params) => props.openBadge(params.id)
      }, {
        path: '/badges/assertion/:id',
        component: Assertion,
        onEnter: (params) => props.openAssertion(params.id)
      }
    ]}
  />

BadgeTabComponent.propTypes = {
  openBadge: T.func.isRequired,
  openAssertion: T.func.isRequired
}

const BadgeTab = connect(
  null,
  dispatch => ({
    openBadge(id = null) {
      dispatch(actions.openBadge('badges.current', id))
    },
    openAssertion(id) {
      dispatch(actions.openAssertion('badges.assertion', id))
    }
  })
)(BadgeTabComponent)

export {
  BadgeTab, BadgeTabActions
}
