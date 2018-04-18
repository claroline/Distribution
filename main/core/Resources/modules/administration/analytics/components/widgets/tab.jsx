import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {actions} from '#/main/core/administration/analytics/actions'

class Tab extends Component {
  constructor(props) {
    super(props)
    
    if (!props.widgets.loaded) {
      props.getWidgetsData()
    }
  }
  
  render() {
    return <div>
      Widgets tab
    </div>
  }
}

Tab.propTypes = {
  widgets: T.shape({
    loaded: T.bool.isRequired,
    data: T.object
  }).isRequired,
  getWidgetsData: T.func.isRequired
}

const TabContainer = connect(
  state => ({
    widgets: state.widgets
  }),
  dispatch => ({
    getWidgetsData() {
      dispatch(actions.getWidgetsData())
    }
  })
)(Tab)

export {
  TabContainer as WidgetsTab
}
