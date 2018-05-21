import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {selectors} from '../selectors'
import {actions} from '../actions'

import {ManagerView} from './manager-view.jsx'
import {UserView} from './user-view.jsx'
import {EventView} from './event-view.jsx'

import {ModalOverlay} from '#/main/app/overlay/modal/containers/overlay'

let SessionEventsToolLayout = props =>
  <div>
    <Router
      routes={[
        {
          path: '/',
          exact: true,
          component: props.canEdit ? ManagerView : UserView
        }, {
          path: '/event/:id',
          component: EventView,
          onEnter: (params = {}) => props.fetch(params.id)
        }
      ]}
    />

    <ModalOverlay />
  </div>

SessionEventsToolLayout.propTypes = {
  canEdit: T.bool
}

function mapStateToProps(state) {
  return {
    canEdit: selectors.canEdit(state)
  }
}

SessionEventsToolLayout = connect(
  mapStateToProps,
  (dispatch) => ({
    fetch(id) {
      dispatch(actions.fetchSessionEvent(id))
    }
  })
)(SessionEventsToolLayout)

export {SessionEventsToolLayout}