import {connect} from 'react-redux'
import {withReducer} from '#/main/app/store/reducer'

import {actions, reducer, selectors} from '#/plugin/cursus/event/store'
import {EventDetails as EventDetailsComponent} from '#/plugin/cursus/event/components/details'

const EventDetails = withReducer(selectors.STORE_NAME, reducer)(
  connect(
    (state) => ({
      event: selectors.event(state),
      registration: selectors.registrations(state)
    }),
    (dispatch) => ({
      register(id) {
        dispatch(actions.register(id))
      }
    })
  )(EventDetailsComponent)
)

export {
  EventDetails
}