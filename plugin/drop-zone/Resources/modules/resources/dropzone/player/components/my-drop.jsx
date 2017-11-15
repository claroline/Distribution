import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_CONFIRM} from '#/main/core/layout/modal'

import {select} from '../../selectors'
import {actions} from '../actions'
import {actions as correctionActions} from '../../correction/actions'

import {Documents} from './documents.jsx'
import {Corrections} from './corrections.jsx'
import {DropForm} from './drop-form.jsx'

const MyDrop = props =>
  <div className="drop-panel">
    <Documents
      documents={props.drop.documents}
      canEdit={props.isDropEnabled && !props.drop.finished}
      {...props}
    />

    {props.dropzone.display.displayCorrectionsToLearners && props.drop.finished && props.drop.corrections.filter(c => c.finished).length > 0 &&
      <Corrections
        corrections={props.drop.corrections.filter(c => c.finished)}
        {...props}
      />
    }

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

    {props.drop.finished && props.isPeerReviewEnabled && props.nbCorrections < props.dropzone.parameters.expectedCorrectionTotal &&
      <a
        href="#/peer/drop"
        className="btn btn-default"
      >
        {trans('peer_correction', {}, 'dropzone')}
      </a>
    }
  </div>

MyDrop.propTypes = {
  dropzone: T.shape({
    parameters: T.shape({
      expectedCorrectionTotal: T.number.isRequired
    }).isRequired,
    display: T.shape({
      displayCorrectionsToLearners: T.bool.isRequired
    }).isRequired
  }).isRequired,
  drop: T.shape({
    id: T.string.isRequired,
    finished: T.bool.isRequired,
    documents: T.array,
    corrections: T.arrayOf(T.shape({
      finished: T.bool.isRequired
    }))
  }).isRequired,
  isDropEnabled: T.bool.isRequired,
  isPeerReviewEnabled: T.bool.isRequired,
  nbCorrections: T.number.isRequired,
  renderMyDrop: T.func.isRequired,
  saveCorrection: T.func.isRequired,
  showModal: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    dropzone: select.dropzone(state),
    drop: select.myDrop(state),
    params: select.dropzoneParameters(state),
    isDropEnabled: select.isDropEnabled(state),
    isPeerReviewEnabled: select.isPeerReviewEnabled(state),
    nbCorrections: select.nbCorrections(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveDrop: (dropType, dropData) => dispatch(actions.saveDrop(dropType, dropData)),
    deleteDocument: (documentId) => dispatch(actions.deleteDocument(documentId)),
    renderMyDrop: () => dispatch(actions.renderMyDrop()),
    saveCorrection: (correction) => dispatch(correctionActions.saveCorrection(correction)),
    showModal: (type, props) => dispatch(modalActions.showModal(type, props))
  }
}

const ConnectedMyDrop = connect(mapStateToProps, mapDispatchToProps)(MyDrop)

export {ConnectedMyDrop as MyDrop}
