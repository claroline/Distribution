import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_CONFIRM} from '#/main/core/layout/modal'

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

    {props.isDropEnabled && !props.drop.finished &&
      <DropForm {...props}/>
    }

    {props.isDropEnabled && !props.drop.finished &&
      <button
        className="btn btn-primary pull-right"
        onClick={() => {
          props.showModal(MODAL_CONFIRM, {
            title: trans('warning', {}, 'dropzone'),
            question: trans('render_my_copy_confirm_message', {}, 'dropzone'),
            handleConfirm: () => props.renderMyDrop()
          })
        }}
      >
        {trans('render_my_copy', {}, 'dropzone')}
      </button>
    }
  </div>

MyDrop.propTypes = {
  drop: T.shape({
    id: T.string.isRequired,
    finished: T.bool.isRequired,
    documents: T.array
  }).isRequired,
  isDropEnabled: T.bool.isRequired,
  renderMyDrop: T.func.isRequired,
  showModal: T.func.isRequired
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
    renderMyDrop: () => dispatch(actions.renderMyDrop()),
    showModal: (type, props) => dispatch(modalActions.showModal(type, props))
  }
}

const ConnectedMyDrop = connect(mapStateToProps, mapDispatchToProps)(MyDrop)

export {ConnectedMyDrop as MyDrop}
