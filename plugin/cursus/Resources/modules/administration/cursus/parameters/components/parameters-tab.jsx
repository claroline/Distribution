import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {Routes} from '#/main/app/router'

import {trans} from '#/main/core/translation'
import {actions as formActions} from '#/main/app/content/form/store'

import {selectors} from '#/plugin/cursus/administration/cursus/store'
import {Parameters} from '#/plugin/cursus/administration/cursus/parameters/components/parameters'
import {Parameters as ParametersType} from '#/plugin/cursus/administration/cursus/prop-types'

const ParametersTabComponent = props =>
  <Routes
    routes={[
      {
        path: '/parameters',
        exact: true,
        component: Parameters,
        onEnter: (params) => props.openForm(props.parameters),
        onLeave: (params) => props.openForm(props.parameters)
      }
    ]}
  />

ParametersTabComponent.propTypes = {
  parameters: T.shape(ParametersType.propTypes).isRequired,
  openForm: T.func.isRequired
}

const ParametersTab = connect(
  (state) => ({
    parameters: selectors.parameters(state)
  }),
  (dispatch) => ({
    openForm(defaultProps) {
      dispatch(formActions.resetForm('parametersForm', defaultProps, true))
    }
  })
)(ParametersTabComponent)

export {
  ParametersTab
}