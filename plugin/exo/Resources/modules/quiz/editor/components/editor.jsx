import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {actions as modalActions} from '#/main/app/overlay/modal/store'
import {Form} from '#/main/app/content/form/components/form'
import {LINK_BUTTON, CALLBACK_BUTTON} from '#/main/app/buttons'

import {TYPE_QUIZ, TYPE_STEP} from './../../enums'

import {actions} from '#/plugin/exo/quiz/editor/actions'
import {select} from '#/plugin/exo/quiz/editor/selectors'
import {ThumbnailBox} from '#/plugin/exo/quiz/editor/components/thumbnail-box'
import {QuizEditor} from '#/plugin/exo/quiz/editor/components/quiz-editor'
import {StepEditor} from '#/plugin/exo/quiz/editor/components/step-editor'

let Editor = props =>
  <Form
    className="quiz-editor"
    validating={props.validating}
    pendingChanges={props.pendingChanges}
    save={{
      type: CALLBACK_BUTTON,
      disabled: !props.saveEnabled,
      callback: props.save
    }}
    cancel={{
      type: LINK_BUTTON,
      target: '/'
    }}
  >
    <ThumbnailBox
      thumbnails={props.thumbnails}
      validating={props.validating}
      onThumbnailClick={props.selectObject}
      onThumbnailMove={props.moveStep}
      onNewStepClick={props.createStep}
      onStepDeleteClick={props.deleteStepAndItems}
      showModal={props.showModal}
    />

    <div className="edit-zone user-select-disabled">
      {selectSubEditor(props)}
    </div>
  </Form>

Editor.propTypes = {
  thumbnails: T.array.isRequired,
  validating: T.bool.isRequired,
  selectObject: T.func.isRequired,
  moveStep: T.func.isRequired,
  createStep: T.func.isRequired,
  deleteStepAndItems: T.func.isRequired,
  showModal: T.func.isRequired,
  save: T.func.isRequired,
  saveEnabled: T.bool.isRequired,
  pendingChanges: T.bool.isRequired
}

function selectSubEditor(props) {
  switch (props.currentObject.type) {
    case TYPE_QUIZ:
      return (
        <QuizEditor
          quiz={props.quizProperties}
          items={props.items}
          tags={props.tags}
          validating={props.validating}
          updateProperties={props.updateQuiz}
          activePanelKey={props.activeQuizPanel}
          handlePanelClick={props.selectQuizPanel}
        />
      )
    case TYPE_STEP:
      return (
        <StepEditor
          step={props.currentObject}
          stepIndex={props.currentObjectIndex}
          mandatoryQuestions={props.quizProperties.parameters.mandatoryQuestions}
          validating={props.validating}
          updateStep={props.updateStep}
          activePanelKey={props.activeStepPanel}
          handlePanelClick={props.selectStepPanel}
          handleItemDelete={props.deleteStepItem}
          handleItemMove={props.moveItem}
          handleItemCreate={props.createItem}
          handleItemChangeStep={props.changeItemStep}
          handleItemDuplicate={props.duplicateItem}
          handleItemUpdate={props.updateItem}
          handleItemHintsUpdate={props.updateItemHints}
          handleItemDetailUpdate={props.updateItemDetail}
          handleItemsImport={props.importItems}
          handleContentItemCreate={props.createContentItem}
          handleContentItemUpdate={props.updateContentItem}
          handleContentItemDetailUpdate={props.updateContentItemDetail}
          handleFileUpload={props.saveContentItemFile}
          numbering={props.quizProperties.parameters.numbering}
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
  currentObjectIndex: T.number.isRequired,
  currentObject: T.shape({
    type: T.string.isRequired
  }).isRequired,
  items: T.array.isRequired,
  tags: T.array.isRequired,
  updateStep: T.string.isRequired,
  activeStepPanel: T.string.isRequired,
  selectStepPanel: T.func.isRequired,
  validating: T.bool.isRequired,
  deleteStepItem: T.func.isRequired,
  moveItem: T.func.isRequired,
  createItem: T.func.isRequired,
  updateItem: T.func.isRequired,
  updateItemHints: T.func.isRequired,
  updateItemDetail: T.func.isRequired,
  importItems: T.func.isRequired,
  createContentItem: T.func.isRequired,
  updateContentItem: T.func.isRequired,
  updateContentItemDetail: T.func.isRequired,
  changeItemStep: T.func.isRequired,
  duplicateItem: T.func.isRequired,
  saveContentItemFile: T.func,
  showModal: T.func.isRequired,
  fadeModal: T.func.isRequired
}

Editor = connect(
  (state) => ({
    thumbnails: select.thumbnails(state),
    items: select.items(state),
    tags: select.tags(state),
    currentObject: select.currentObjectDeep(state),
    currentObjectIndex: select.currentObjectIndex(state),
    activeQuizPanel: select.quizOpenPanel(state),
    activeStepPanel: select.stepOpenPanel(state),
    quizProperties: select.quiz(state),
    validating: select.validating(state),
    pendingChanges: !select.saved(state),
    saveEnabled: select.saveEnabled(state)
  }),
  Object.assign({}, modalActions, actions) // todo : only grab needed actions
)(Editor)

export {
  Editor
}
