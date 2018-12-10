import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'
import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {Routes} from '#/main/app/router'

import {makeId} from '#/main/core/scaffolding/id'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions'

import {Frameworks} from '#/plugin/competency/administration/competency/framework/components/frameworks'

const FrameworkTabActions = () =>
  <PageActions>
    <PageAction
      type={LINK_BUTTON}
      icon="fa fa-plus"
      label={trans('framework.create', {}, 'competency')}
      target="/frameworks/form"
      primary={true}
    />
  </PageActions>

const FrameworkTabComponent = props =>
  <Routes
    routes={[
      {
        path: '/frameworks',
        exact: true,
        component: Frameworks
      }
    ]}
  />

FrameworkTabComponent.propTypes = {
}

const FrameworkTab = connect(
  (state) => ({
  }),
  (dispatch) => ({
  })
)(FrameworkTabComponent)

export {
  FrameworkTabActions,
  FrameworkTab
}
