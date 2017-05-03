import {connect} from 'react-redux'
import React, {Component, PropTypes as T} from 'react'

/* global Translator */
/* global Routing */

const trans = (key, domain) => Translator.trans(key, {}, domain)

class SessionEvents extends Component {
  render() {
    return (
      <div>
        {trans('claroline_session_events_tool', 'tools')}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

const ConnectedSessionEvents = connect(mapStateToProps, mapDispatchToProps)(SessionEvents)

export {ConnectedSessionEvents as SessionEvents}