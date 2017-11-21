import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {tex} from '#/main/core/translation'
import {Routes} from '#/main/core/router/components/router.jsx'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'

import {TYPE_QUIZ, TYPE_STEP} from './../../enums'
import {actions} from './../actions'
import {select} from './../selectors'

import {CustomDragLayer} from './../../../utils/custom-drag-layer.jsx'
import {ThumbnailBox} from './thumbnail-box.jsx'
import {QuizEditor} from './quiz-editor.jsx'
import {StepEditor} from './step-editor.jsx'

const EditorComponent = props =>
  <div className="quiz-editor">
    <ThumbnailBox
      thumbnails={props.thumbnails}
      validating={props.validating}
      onThumbnailClick={props.selectObject}
      onThumbnailMove={props.moveStep}
      onNewStepClick={props.createStep}
      onStepDeleteClick={props.deleteStep}
    />

    <div className="edit-zone user-select-disabled">
      <Routes
        path=""
        routes={[
          {
            path: '/edit/parameters',
            onEnter: () => props.selectObject(props.quiz.id, TYPE_QUIZ),
            component: QuizEditor
          }, {
            path: '/edit/steps/:id',
            onEnter: (params) => props.selectObject(params.id, TYPE_STEP),
            component: StepEditor
          }
        ]}
      />
    </div>

    <CustomDragLayer />
  </div>

EditorComponent.propTypes = {
  quiz: T.shape({
    id: T.string.isRequired
  }).isRequired,
  thumbnails: T.array.isRequired,
  validating: T.bool.isRequired,

  selectObject: T.func.isRequired,
  moveStep: T.func.isRequired,
  createStep: T.func.isRequired,
  deleteStep: T.func.isRequired
}

function mapStateToProps(state) {
  return {
    quiz: select.quiz(state),
    thumbnails: select.thumbnails(state),
    validating: select.validating(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    selectObject(id, type) {
      dispatch(actions.selectObject(id, type))
    },
    createStep(position) {
      dispatch(actions.createStep(position))
    },
    deleteStep(id) {
      dispatch(
        modalActions.showModal(MODAL_DELETE_CONFIRM, {
          title: tex('delete_step'),
          question: tex('remove_step_confirm_message'),
          handleConfirm: () => dispatch(actions.deleteStepAndItems(id))
        })
      )
    },
    moveStep(id, swapId) {
      dispatch(actions.moveStep(id, swapId))
    }
  }
}

const Editor = connect(mapStateToProps, mapDispatchToProps)(EditorComponent)

export {
  Editor
}
