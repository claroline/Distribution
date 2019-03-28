import {connect} from 'react-redux'

import {actions as modalActions} from '#/main/app/overlay/modal/store'

import {selectors as pathSelectors} from '#/plugin/path/resources/path/store'
import {actions} from '#/plugin/path/resources/path/dashboard/store'
import {MODAL_USER_PROGRESSION} from '#/plugin/path/resources/path/modals/user-progression'
import {DashboardMain as DashboardMainComponent} from '#/plugin/path/resources/path/dashboard/components/main'

const DashboardMain = connect(
  (state) => ({
    path: pathSelectors.path(state)
  }),
  (dispatch) => ({
    fetchUserStepsProgression(resourceId, userId) {
      dispatch(actions.fetchUserStepsProgression(resourceId, userId))
    },
    showStepsProgressionModal(evaluation, steps) {
      dispatch(
        modalActions.showModal(MODAL_USER_PROGRESSION, {
          evaluation: evaluation,
          steps: steps
        })
      )
    }
  })
)(DashboardMainComponent)

export {
  DashboardMain
}
