import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
//import {trans} from '#/main/core/translation'

import {select} from '../../selectors'
//import {actions} from '../actions'

import {Documents} from '../../player/components/documents.jsx'
import {Corrections} from './corrections.jsx'
import {CorrectionCreation} from './correction-creation.jsx'

const Drop = props =>
  <div id="drop-container">
    <Documents
      documents={props.drop.documents || []}
    />
    {props.drop.corrections && props.drop.corrections.length > 0 &&
      <Corrections
        corrections={props.drop.corrections || []}
      />
    }
    <CorrectionCreation {...props}/>
  </div>

Drop.propTypes = {
  drop: T.shape({
    id: T.string,
    documents: T.array,
    corrections: T.array
  })
}

function mapStateToProps(state) {
  return {
    drop: select.currentDrop(state)
  }
}

function mapDispatchToProps() {
  return {}
}

const ConnectedDrop = connect(mapStateToProps, mapDispatchToProps)(Drop)

export {ConnectedDrop as Drop}