import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions'
import {LINK_BUTTON} from '#/main/app/buttons'

import {Badge}  from '#/plugin/open-badge/tools/badges/badge/components/badge'
import {Badges} from '#/plugin/open-badge/tools/badges/badge/components/badges'
import {BadgeViewer} from '#/plugin/open-badge/tools/badges/badge/components/badge-viewer'
import {Assertion} from '#/plugin/open-badge/tools/badges/assertion/components/assertion-page'

import {actions}    from '#/plugin/open-badge/tools/badges/store/actions'

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
      }, {
        path: '/badges/view/:id',
        component: BadgeViewer,
        onEnter: (params) => props.openBadge(params.id)
      }
    ]}
  />

BadgeTabComponent.propTypes = {
  openBadge: T.func.isRequired,
  openAssertion: T.func.isRequired
}

const BadgeTab = connect(
  (state) => ({
    context: state.context
  }),
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
  BadgeTab,
  BadgeTabActions
}
