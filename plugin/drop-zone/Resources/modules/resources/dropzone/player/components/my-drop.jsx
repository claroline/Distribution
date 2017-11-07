import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'

import {select} from '../../selectors'
import {actions} from '../actions'

import {Documents} from './documents.jsx'
import {DropForm} from './drop-form.jsx'

const MyDrop = props =>
  <div className="drop-panel">
    <Documents
      documents={props.drop.documents}
      {...props}
    />

    {props.isDropEnabled &&
      <DropForm {...props}/>
    }
  </div>

MyDrop.propTypes = {
  drop: T.shape({
    documents: T.array
  }).isRequired,
  isDropEnabled: T.bool.isRequired
}

function mapStateToProps(state) {
  return {
    drop: select.myDrop(state),
    params: select.dropzoneParameters(state),
    isDropEnabled: select.isDropEnabled(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveDrop: (dropType, dropData) => dispatch(actions.saveDrop(dropType, dropData)),
    deleteDocument: (documentId) => dispatch(actions.deleteDocument(documentId)),
    showModal: (type, props) => dispatch(modalActions.showModal(type, props))
  }
}

const ConnectedMyDrop = connect(mapStateToProps, mapDispatchToProps)(MyDrop)

export {ConnectedMyDrop as MyDrop}
