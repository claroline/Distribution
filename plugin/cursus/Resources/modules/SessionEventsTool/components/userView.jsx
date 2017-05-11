import {connect} from 'react-redux'
import React, {Component, PropTypes as T} from 'react'
import {selectors} from '../selectors'

/* global Routing */

class UserView extends Component {
  render() {
    return (
      <div>
        {this.props.events.map((event, idx) =>
          <div key={idx}>
            {event.name}
          </div>
        )}
      </div>
    )
  }
}

UserView.propTypes = {
  events: T.arrayOf(T.shape({
    id: T.number.isRequired,
    name: T.string.isRequired,
    startDate: T.string.isRequired,
    endDate: T.string.isRequired,
    registrationType: T.number.isRequired
  })).isRequired
}

function mapStateToProps(state) {
  return {
    events: selectors.sessionEvents(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

const ConnectedUserView = connect(mapStateToProps, mapDispatchToProps)(UserView)

export {ConnectedUserView as UserView}