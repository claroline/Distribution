import set from 'lodash/set'
import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {Routes} from '#/main/app/router'

import {makeId} from '#/main/core/scaffolding/id'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions'

import {actions} from '#/plugin/competency/administration/competency/framework/store'
import {Frameworks} from '#/plugin/competency/administration/competency/framework/components/frameworks'
import {FrameworkForm} from '#/plugin/competency/administration/competency/framework/components/framework-form'

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
      }, {
        path: '/frameworks/form/:id?',
        component: FrameworkForm,
        onEnter: (params) => props.openForm(params.id),
        onLeave: () => props.resetForm()
      }
    ]}
  />

FrameworkTabComponent.propTypes = {
  openForm: T.func.isRequired,
  resetForm: T.func.isRequired
}

const FrameworkTab = connect(
  (state) => ({
  }),
  (dispatch) => ({
    openForm(id = null) {
      const defaultProps = {}
      set(defaultProps, 'id', makeId())

      dispatch(actions.open('frameworks.form', defaultProps, id))
    },
    resetForm() {
      dispatch(actions.reset('frameworks.form'))
    }
  })
)(FrameworkTabComponent)

export {
  FrameworkTabActions,
  FrameworkTab
}
