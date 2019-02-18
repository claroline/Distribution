import {connect} from 'react-redux'

import {withRouter} from '#/main/app/router'
import {trans} from '#/main/app/intl/translation'

import {selectors as resourceSelect} from '#/main/core/resource/store'

import {EditorMain as EditorMainComponent} from '#/plugin/path/resources/path/editor/components/main'
import {actions, selectors} from '#/plugin/path/resources/path/editor/store'
import {actions as pathActions, selectors as pathSelectors} from '#/plugin/path/resources/path/store'
import {flattenSteps} from '#/plugin/path/resources/path/utils'

const EditorMain = withRouter(
  connect(
    (state) => ({
      summaryOpened: pathSelectors.summaryOpened(state),
      summaryPinned: pathSelectors.summaryPinned(state),

      path: selectors.path(state),
      steps: flattenSteps(selectors.steps(state)),
      resourceParent: resourceSelect.parent(state),
      workspace: resourceSelect.workspace(state)
    }),
    (dispatch) => ({
      // step management
      addStep(parentStep = null) {
        dispatch(actions.addStep(parentStep ? parentStep.id : null))
      },
      removeStep(step, history) {
        dispatch(actions.removeStep(step.id))

        if (`/edit/${step.id}` === history.location.pathname) {
          history.push('/edit')
        }
      },
      copyStep(step, position) {
        dispatch(actions.copyStep(step))
        dispatch(actions.paste(parentStep ? parentStep.id : null))
      },
      moveStep(step, position) {

      },

      // embedded resources management
      pickSecondaryResources(stepId, selected) {
        dispatch(actions.addSecondaryResources(stepId, selected))
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
      computeResourceDuration(resourceId) {
        dispatch(pathActions.computeResourceDuration(resourceId))
      }
    })
  )(EditorMainComponent)
)

export {
  EditorMain
}
