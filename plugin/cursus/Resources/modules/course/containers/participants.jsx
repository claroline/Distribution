import {connect} from 'react-redux'

import {actions as listActions} from '#/main/app/content/list/store'

import {actions} from '#/plugin/cursus/tools/trainings/catalog/store'
import {CourseParticipants as CourseParticipantsComponent} from '#/plugin/cursus/course/components/participants'

const CourseParticipants = connect(
  null,
  (dispatch) => ({
    addTutors(sessionId, users) {
      dispatch(actions.addTutors(sessionId, users))
    },
    invalidateList(listName) {
      dispatch(listActions.invalidateData(listName))
    }
  })
)(CourseParticipantsComponent)

export {
  CourseParticipants
}
