import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {select} from '#/main/core/administration/import/selector'

const ClassPanel = props => <div>gdfffffdddgff</div>

const Import = props =>
  <div>
    {Object.keys(props.explanation).map((key) =>
      <ClassPanel
         key={key}
         title={key}
         explanation={props.explanation[key]}
      />
    )}
  </div>

const ConnectedImport = connect(
  state => ({
    explanation: select.explanation(state)
  }),
  dispatch =>({
  })
)(Import)

export {
  ConnectedImport as Import
}
