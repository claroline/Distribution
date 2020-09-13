import {connect} from 'react-redux'

import {actions as listActions} from '#/main/app/content/list/store'

import {actions, selectors} from '#/plugin/cursus/tools/cursus/catalog/store'
import {CourseEvents as CourseEventsComponent} from '#/plugin/cursus/course/components/events'

const CourseEvents = connect(
  null,
  (dispatch) => ({
    reload(courseSlug) {
      dispatch(actions.open(courseSlug, true))
    },
    invalidateList() {
      dispatch(listActions.invalidateData(selectors.STORE_NAME+'.courseEvents'))
    }
  })
)(CourseEventsComponent)

export {
  CourseEvents
}
