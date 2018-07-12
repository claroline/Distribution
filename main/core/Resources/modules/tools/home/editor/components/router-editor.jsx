import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {Routes} from '#/main/app/router'

import {Tab as TabTypes} from '#/main/core/tools/home/prop-types'
import {select} from '#/main/core/tools/home/selectors'
import {actions} from '#/main/core/tools/home/actions'
import {Editor} from '#/main/core/tools/home/editor/components/editor'

const RouterEditorComponent = props =>
  <Routes
    redirect={[
      {from: '/edit', exact: true, to: '/edit/tab/'+props.sortedTabs[0].id}
    ]}
    routes={[
      {
        path: '/edit/tab/:id',
        exact: true,
        component: Editor,
        onEnter: (params) => {
          props.setCurrentTab(params.id)
        },
        disabled: !props.editable
      }
    ]}
  />


RouterEditorComponent.propTypes = {
  setCurrentTab: T.func.isRequired,
  editable: T.bool.isRequired,
  sortedTabs: T.arrayOf(T.shape(
    TabTypes.propTypes
  ))
}

const RouterEditor = connect(
  state => ({
    editable: select.editable(state),
    sortedTabs: select.sortedTabs(state)
  }),
  dispatch => ({
    setCurrentTab(tab){
      dispatch(actions.setCurrentTab(tab))
    }
  })
)(RouterEditorComponent)

export {
  RouterEditor
}
