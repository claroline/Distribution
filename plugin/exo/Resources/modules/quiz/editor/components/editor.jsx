import React from 'react'
import invariant from 'invariant'
import {connect} from 'react-redux'
import {ThumbnailBox} from './thumbnail-box.jsx'
import {QuizEditor} from './quiz-editor.jsx'
import {StepEditor} from './step-editor.jsx'
import Modals from './modals.jsx'
import {actions} from './../actions'
import {TYPE_QUIZ, TYPE_STEP} from './../../enums'
import select from './../selectors'

const T = React.PropTypes

let Editor = props =>
  <div className="quiz-editor">
    <ThumbnailBox
      thumbnails={props.thumbnails}
      onThumbnailClick={props.selectObject}
      onThumbnailMove={props.moveStep}
      onNewStepClick={props.createStep}
      onStepDeleteClick={props.deleteStepAndItems}
      showModal={props.showModal}
    />
    <div className="edit-zone">{selectSubEditor(props)}</div>
    {makeModal(props)}
  </div>

Editor.propTypes = {
  thumbnails: T.arrayOf(T.object).isRequired,
  selectObject: T.func.isRequired,
  moveStep: T.func.isRequired,
  createStep: T.func.isRequired,
  deleteStepAndItems: T.func.isRequired,
  showModal: T.func.isRequired
}

function selectSubEditor(props) {
  switch (props.currentObject.type) {
    case TYPE_QUIZ:
      return (
        <QuizEditor
          quiz={props.quizProperties}
          updateProperties={props.updateQuiz}
          activePanelKey={props.activeQuizPanel}
          handlePanelClick={props.selectQuizPanel}
        />
      )
    case TYPE_STEP:
      return (
        <StepEditor
          step={props.currentObject}
          updateStep={props.updateStep}
          activePanelKey={props.activeStepPanel}
          handlePanelClick={props.selectStepPanel}
          handleItemDeleteClick={props.deleteItem}
          handleItemMove={props.moveItem}
          handleItemCreate={props.createItem}
          handleItemUpdate={props.updateItem}
          handleItemHintsUpdate={props.updateItemHints}
          handleItemDetailUpdate={props.updateItemDetail}
          handleItemsImport={props.importItems}
          showModal={props.showModal}
          closeModal={props.fadeModal}
        />
      )
  }
  throw new Error(`Unkwnown type ${props.currentObject}`)
}

selectSubEditor.propTypes = {
  activeQuizPanel: T.string.isRequired,
  selectQuizPanel: T.func.isRequired,
  updateQuiz: T.func.isRequired,
  quizProperties: T.object.isRequired,
  currentObject: T.shape({
    type: T.string.isRequired
  }).isRequired,
  updateStep: T.string.isRequired,
  activeStepPanel: T.string.isRequired,
  selectStepPanel: T.func.isRequired,
  deleteItem: T.func.isRequired,
  moveItem: T.func.isRequired,
  createItem: T.func.isRequired,
  updateItem: T.func.isRequired,
  updateItemHints: T.func.isRequired,
  updateItemDetail: T.func.isRequired,
  importItems: T.func.isRequired,
  showModal: T.func.isRequired,
  fadeModal: T.func.isRequired
}

function makeModal(props) {
  if (props.modal.type) {
    invariant(Modals[props.modal.type], `Unknown modal type "${props.modal.type}"`)
    const Modal = Modals[props.modal.type]
    return (
      <Modal
        show={!props.modal.fading}
        fadeModal={props.fadeModal}
        hideModal={props.hideModal}
        {...props.modal.props}
      />
    )
  }
}

makeModal.propTypes = {
  modal: T.shape({
    type: T.string.isRequired,
    fading: T.bool.isRequired,
    props: T.object.isRequired
  }),
  fadeModal: T.func.isRequired,
  hideModal: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    thumbnails: select.thumbnails(state),
    currentObject: select.currentObjectDeep(state),
    activeQuizPanel: select.quizOpenPanel(state),
    activeStepPanel: select.stepOpenPanel(state),
    quizProperties: select.quiz(state),
    modal: select.modal(state)
  }
}

Editor = connect(mapStateToProps, actions)(Editor)

export {Editor}
