import React from 'react'
import invariant from 'invariant'
import {connect} from 'react-redux'
import {ThumbnailBox} from './thumbnail-box.jsx'
import {QuizEditor} from './quiz-editor.jsx'
import {StepEditor} from './step-editor.jsx'
import Modals from './modals.jsx'
import {actions} from './../actions'
import {TYPE_QUIZ, TYPE_STEP} from './../types'
import select from './../selectors'

const T = React.PropTypes

let Editor = props =>
  <div className="panel-body quiz-editor">
    <ThumbnailBox
      thumbnails={props.thumbnails}
      onThumbnailClick={props.handleThumbnailClick}
      onThumbnailMove={props.handleThumbnailMove}
      onNewStepClick={props.handleNewStepClick}
      onStepDeleteClick={props.handleStepDeleteClick}
      showModal={props.showModal}
    />
    <div className="edit-zone">{selectSubEditor(props)}</div>
    {makeModal(props)}
  </div>

Editor.propTypes = {
  thumbnails: T.arrayOf(T.object).isRequired,
  handleThumbnailClick: T.func.isRequired,
  handleThumbnailMove: T.func.isRequired,
  handleNewStepClick: T.func.isRequired,
  handleStepDeleteClick: T.func.isRequired,
  showModal: T.func.isRequired
}

function selectSubEditor(props) {
  switch (props.currentObject.type) {
    case TYPE_QUIZ:
      return (
        <QuizEditor
          activePanelKey={props.activeQuizPanel}
          handlePanelClick={props.handleQuizPanelClick}
          initialValues={props.quizProperties}
        />
      )
    case TYPE_STEP:
      return (
        <StepEditor
          step={props.currentObject}
          activePanelKey={props.activeStepPanel}
          handlePanelClick={props.handleStepPanelClick}
          handleItemDeleteClick={props.handleItemDeleteClick}
          handleItemMove={props.handleItemMove}
          handleItemCreate={props.handleItemCreate}
          showModal={props.showModal}
          closeModal={props.fadeModal}
        />
      )
  }
  throw new Error(`Unkwnown type ${props.currentObject}`)
}

selectSubEditor.propTypes = {
  activeQuizPanel: T.string.isRequired,
  handleQuizPanelClick: T.func.isRequired,
  quizProperties: T.object.isRequired,
  currentObject: T.shape({
    type: T.string.isRequired
  }).isRequired,
  activeStepPanel: T.string.isRequired,
  handleStepPanelClick: T.func.isRequired,
  handleItemDeleteClick: T.func.isRequired,
  handleItemMove: T.func.isRequired,
  handleItemCreate: T.func.isRequired,
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
    quizProperties: select.quizProperties(state),
    modal: select.modal(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleThumbnailClick(id, type) {
      dispatch(actions.selectObject(id, type))
    },
    handleThumbnailMove(id, swapId) {
      dispatch(actions.moveStep(id, swapId))
    },
    handleNewStepClick() {
      dispatch(actions.createStep())
    },
    handleQuizPanelClick(panelKey) {
      dispatch(actions.selectQuizPanel(panelKey))
    },
    handleStepPanelClick(stepId, panelKey) {
      dispatch(actions.selectStepPanel(stepId, panelKey))
    },
    handleStepDeleteClick(stepId) {
      dispatch(actions.deleteStepAndItems(stepId))
    },
    handleItemDeleteClick(itemId, stepId) {
      dispatch(actions.deleteItem(itemId, stepId))
    },
    handleItemMove(id, swapId, stepId) {
      dispatch(actions.moveItem(id, swapId, stepId))
    },
    handleItemCreate(stepId, type) {
      dispatch(actions.createItem(stepId, type))
    },
    fadeModal() {
      dispatch(actions.fadeModal())
    },
    hideModal() {
      dispatch(actions.hideModal())
    },
    showModal(type, props) {
      dispatch(actions.showModal(type, props))
    }
  }
}

Editor = connect(mapStateToProps, mapDispatchToProps)(Editor)

export {Editor}
