import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_CONFIRM} from '#/main/core/layout/modal'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'

import {DropzoneType, DropType} from '#/plugin/drop-zone/resources/dropzone/prop-types'
import {select} from '#/plugin/drop-zone/resources/dropzone/selectors'
import {actions} from '#/plugin/drop-zone/resources/dropzone/player/actions'
import {actions as correctionActions} from '#/plugin/drop-zone/resources/dropzone/correction/actions'
import {Documents} from '#/plugin/drop-zone/resources/dropzone/components/documents.jsx'
import {Corrections} from '#/plugin/drop-zone/resources/dropzone/player/components/corrections.jsx'
import {DropForm} from '#/plugin/drop-zone/resources/dropzone/player/components/drop-form.jsx'

const MyDrop = props =>
  <div className="drop-panel">
    <FormSections>
      <FormSection
        id="instructions-section"
        title={trans('instructions', {}, 'dropzone')}
      >
        <HtmlText>
          {props.dropzone.display.instruction}
        </HtmlText>
      </FormSection>
    </FormSections>

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
            question: trans('submit_my_copy_confirm_message', {}, 'dropzone'),
            handleConfirm: () => props.renderMyDrop()
          })
        }}
      >
        {trans('submit_my_copy', {}, 'dropzone')}
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
  dropzone: T.shape(DropzoneType.propTypes).isRequired,
  drop: T.shape(DropType.propTypes).isRequired,
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
    isDropEnabled: select.isDropEnabled(state),
    isPeerReviewEnabled: select.isPeerReviewEnabled(state),
    nbCorrections: select.nbCorrections(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    saveDocument: (dropType, dropData) => dispatch(actions.saveDocument(dropType, dropData)),
    deleteDocument: (documentId) => dispatch(actions.deleteDocument(documentId)),
    renderMyDrop: () => dispatch(actions.renderMyDrop()),
    saveCorrection: (correction) => dispatch(correctionActions.saveCorrection(correction)),
    showModal: (type, props) => dispatch(modalActions.showModal(type, props))
  }
}

const ConnectedMyDrop = connect(mapStateToProps, mapDispatchToProps)(MyDrop)

export {ConnectedMyDrop as MyDrop}
