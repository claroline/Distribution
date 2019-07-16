import set from 'lodash/set'
import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'

import {makeId} from '#/main/core/scaffolding/id'
import {selectors as toolSelectors} from '#/main/core/tool/store'
import {PageActions, PageAction} from '#/main/core/layout/page/components/page-actions'

import {selectors as competencySelectors} from '#/plugin/competency/administration/competency/store'
import {actions} from '#/plugin/competency/administration/competency/scale/store'
import {Scales} from '#/plugin/competency/administration/competency/scale/components/scales'
import {Scale} from '#/plugin/competency/administration/competency/scale/components/scale'

const ScaleTabComponent = props =>
  <Routes
    path={props.path}
    routes={[
      {
        path: '/scales',
        exact: true,
        render: () => {
          const component = <Scales path={props.path} />

          return component
        }
      }, {
        path: '/scales/form/:id?',
        render: () => {
          const component = <Scale path={props.path} />

          return component
        },
        onEnter: (params) => props.openForm(params.id),
        onLeave: () => props.resetForm()
      }
    ]}
  />

ScaleTabComponent.propTypes = {
  path: T.string.isRequired,
  openForm: T.func.isRequired,
  resetForm: T.func.isRequired
}

const ScaleTab = connect(
  (state) => ({
    path: toolSelectors.path(state)
  }),
  (dispatch) => ({
    openForm(id = null) {
      const defaultProps = {}
      set(defaultProps, 'id', makeId())

      dispatch(actions.open(competencySelectors.STORE_NAME + '.scales.current', defaultProps, id))
    },
    resetForm() {
      dispatch(actions.reset(competencySelectors.STORE_NAME + '.scales.current'))
    }
  })
)(ScaleTabComponent)

export {
  ScaleTab
}
