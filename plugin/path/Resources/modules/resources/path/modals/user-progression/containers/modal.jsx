import React from 'react'
import {connect} from 'react-redux'

import {selectors as dashboardSelectors} from '#/plugin/path/resources/path/dashboard/store'
import {UserProgressionModal as UserProgressionModalComponent} from '#/plugin/path/resources/path/modals/user-progression/components/modal'

const UserProgressionModal = connect(
  (state) => ({
    stepsProgression: dashboardSelectors.stepsProgression(state)
  })
)(UserProgressionModalComponent)

export {
  UserProgressionModal
}
