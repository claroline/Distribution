import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {actions as modalActions} from '#/main/app/overlay/modal/store'
import {MODAL_CONFIRM} from '#/main/app/modals/confirm'
import {MODAL_RESOURCE_EXPLORER} from '#/main/core/resource/modals/explorer'
import {Routes} from '#/main/app/router'
import {selectors as resourceSelect} from '#/main/core/resource/store'
import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'
import {actions as formActions} from '#/main/app/content/form/store/actions'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

import {actions, selectors} from '#/plugin/path/resources/path/editor/store'
import {PathCurrent} from '#/plugin/path/resources/path/components/current'
import {PathSummary} from '#/plugin/path/resources/path/components/summary'
import {ParametersForm} from '#/plugin/path/resources/path/editor/components/parameters-form'
import {StepForm} from '#/plugin/path/resources/path/editor/components/step-form'
import {Path as PathTypes, Step as StepTypes} from '#/plugin/path/resources/path/prop-types'
import {constants} from '#/plugin/path/resources/path/constants'
import {getNumbering, flattenSteps} from '#/plugin/path/resources/path/utils'
import {getFormDataPart} from '#/plugin/path/resources/path/editor/utils'

// todo : replaces copy/paste feature by a duplicate one (that's how it works elsewhere)

const EditorComponent = props =>
  <section className="summarized-content">
    <h2 className="sr-only">{trans('configuration')}</h2>

    <PathSummary
      prefix="edit"
      steps={props.path.steps}
      actions={[
        {
          icon: 'fa fa-fw fa-plus',
          label: trans('step_add_child', {}, 'path'),
          action: props.addStep
        }, {
          icon: 'fa fa-fw fa-files-o',
          label: trans('copy', {}, 'actions'),
          action: props.copyStep
        }, {
          icon: 'fa fa-fw fa-clipboard',
          label: trans('paste', {}, 'actions'),
          action: props.pasteStep,
          displayed: !!props.copy
        }, {
          icon: 'fa fa-fw fa-trash-o',
          label: trans('delete', {}, 'actions'),
          action: props.removeStep
        }
      ]}
      parameters={true}
      add={props.addStep}
    />

    <Routes
      redirect={[
        {from: '/edit/', to: '/edit/parameters', exact: true}
      ]}
      routes={[
        {
          path: '/edit/parameters',
          exact: true,
          render: () => {
            const Parameters = <ParametersForm path={props.path} saveForm={() => props.saveForm(props.path.id)}/>

            return Parameters
          }
        }, {
          path: '/edit/:id',
          render: (routeProps) => {
            const step = props.steps.find(step => routeProps.match.params.id === step.id)

            const CurrentStep = (
              <PathCurrent
                prefix="/edit"
                current={step}
                all={props.steps}
                navigation={true}
              >
                <h3 className="h2 step-title">
                  {getNumbering(props.path.display.numbering, props.path.steps, step) &&
                    <span className="step-numbering">{getNumbering(props.path.display.numbering, props.path.steps, step)}</span>
                  }

                  {step.title}
                </h3>

                <StepForm
                  {...step}
                  numbering={getNumbering(props.path.display.numbering, props.path.steps, step)}
                  customNumbering={constants.NUMBERING_CUSTOM === props.path.display.numbering}
                  stepPath={getFormDataPart(step.id, props.path.steps)}
                  pickSecondaryResources={stepId => props.pickResources(stepId, 'secondary', props.resourceParent)}
                  removeSecondaryResource={props.removeSecondaryResource}
                  updateSecondaryResourceInheritance={props.updateSecondaryResourceInheritance}
                  removeInheritedResource={props.removeInheritedResource}
                  saveForm={() => props.saveForm(props.path.id)}
                />
              </PathCurrent>
            )

            return CurrentStep
          }
        }
      ]}
    />
  </section>

EditorComponent.propTypes = {
  path: T.shape(
    PathTypes.propTypes
  ).isRequired,
  steps: T.arrayOf(T.shape(
    StepTypes.propTypes
  )),
  copy: T.shape(StepTypes.propTypes),
  resourceParent: T.shape(ResourceNodeTypes.propTypes),
  addStep: T.func.isRequired,
  removeStep: T.func.isRequired,
  pickResources: T.func.isRequired,
  removeSecondaryResource: T.func.isRequired,
  updateSecondaryResourceInheritance: T.func.isRequired,
  removeInheritedResource: T.func.isRequired,
  copyStep: T.func.isRequired,
  pasteStep: T.func.isRequired,
  saveForm: T.func.isRequired
}

// todo merge resources pickers

const Editor = connect(
  state => ({
    path: selectors.path(state),
    steps: flattenSteps(selectors.steps(state)),
    copy: selectors.stepCopy(state),
    resourceParent: resourceSelect.parent(state)
  }),
  dispatch => ({
    addStep(parentStep = null) {
      dispatch(actions.addStep(parentStep ? parentStep.id : null))
    },
    removeStep(step) {
      dispatch(
        modalActions.showModal(MODAL_CONFIRM, {
          icon: 'fa fa-fw fa-trash-o',
          title: trans('step_delete_title', {}, 'path'),
          question: trans('step_delete_confirm', {}, 'path'),
          dangerous: true,
          handleConfirm: () => dispatch(actions.removeStep(step.id))
        })
      )
    },
    copyStep(step) {
      dispatch(actions.copyStep(step))
    },
    pasteStep(parentStep = null) {
      dispatch(actions.paste(parentStep ? parentStep.id : null))
    },
    pickResources(stepId, usage = 'primary', current = null) {
      let title
      let callback
      if ('secondary' === usage) {
        title = trans('add_secondary_resources', {}, 'path')
        callback = (selected) => dispatch(actions.addSecondaryResources(stepId, selected))
      }
      dispatch(modalActions.showModal(MODAL_RESOURCE_EXPLORER, {
        title: title,
        current: current,
        selectAction: (selected) => ({
          type: CALLBACK_BUTTON,
          callback: () => callback(selected)
        })
      }))
    },
    removeSecondaryResource(stepId, id) {
      dispatch(actions.removeSecondaryResources(stepId, [id]))
    },
    updateSecondaryResourceInheritance(stepId, id, value) {
      dispatch(actions.updateSecondaryResourceInheritance(stepId, id, value))
    },
    removeInheritedResource(stepId, id) {
      dispatch(actions.removeInheritedResources(stepId, [id]))
    },
    saveForm: (pathId) => dispatch(formActions.saveForm(selectors.FORM_NAME, ['apiv2_path_update', {id: pathId}]))
  })
)(EditorComponent)

export {
  Editor
}
