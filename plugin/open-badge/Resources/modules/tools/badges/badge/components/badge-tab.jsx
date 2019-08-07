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
import {selectors}  from '#/plugin/open-badge/tools/badges/store/selectors'
import {selectors as toolSelectors} from '#/main/core/tool/store'
import {actions}    from '#/plugin/open-badge/tools/badges/store/actions'

const BadgeTabActionsComponent = props =>
  <PageActions>
    {props.currentContext !== 'desktop' &&
      <PageAction
        type={LINK_BUTTON}
        icon="fa fa-plus"
        label={trans('add_badge')}
        target={props.path+'/badges/form'}
        primary={true}
      />
    }
  </PageActions>

const BadgeTabComponent = props => {
  return <Routes
    path={props.path}
    routes={[
      {
        path: '/badges',
        exact: true,
        component: Badges
      }, {
        path: '/badges/form/:id?',
        component: Badge,
        exact: true,
        onEnter: (params) => props.openBadge(params.id, props.workspace)
      }, {
        path: '/badges/assertion/:id',
        component: Assertion,
        exact: true,
        onEnter: (params) => props.openAssertion(params.id)
      }, {
        path: '/badges/view/:id',
        component: BadgeViewer,
        exact: true,
        onEnter: (params) => props.openBadge(params.id, props.workspace)
      }
    ]}
  />
}


BadgeTabComponent.propTypes = {
  openBadge: T.func.isRequired,
  openAssertion: T.func.isRequired,
  workspace: T.object,
  path: T.string
}

const BadgeTab = connect(
  (state) => ({
    currentContext: state.tool.currentContext,
    workspace: state.workspace,
    path: toolSelectors.path(state)
  }),
  dispatch => ({
    openBadge(id = null, workspace = null) {
      dispatch(actions.openBadge(selectors.STORE_NAME + '.badges.current', id, workspace))
    },
    openAssertion(id) {
      dispatch(actions.openAssertion(selectors.STORE_NAME + '.badges.assertion', id))
    }
  })
)(BadgeTabComponent)

const BadgeTabActions = connect(
  (state) => ({
    path: toolSelectors.path(state),
    currentContext: state.currentContext
  })
)(BadgeTabActionsComponent)

export {
  BadgeTab,
  BadgeTabActions
}
