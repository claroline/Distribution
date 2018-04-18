import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {actions} from '#/main/core/administration/analytics/actions'

class Tab extends Component {
  constructor(props) {
    super(props)
    
    if (!props.topActions.loaded) {
      props.getTopActionsData()
    }
  }
  
  render() {
    return <div>
      Top actions tab
    </div>
  }
}

Tab.propTypes = {
  topActions: T.shape({
    loaded: T.bool.isRequired,
    data: T.object
  }).isRequired,
  getTopActionsData: T.func.isRequired
}

const TabContainer = connect(
  state => ({
    topActions: state.topActions
  }),
  dispatch => ({
    getTopActionsData() {
      dispatch(actions.getTopActionsData())
    }
  })
)(Tab)

export {
  TabContainer as TopActionsTab
}
