import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {actions} from '#/main/core/administration/analytics/actions'

class Tab extends Component {
  constructor(props) {
    super(props)
    
    if (!props.resources.loaded) {
      props.getResourcesData()
    }
  }
  
  render() {
    return <div>
      Resources tab
    </div>
  }
}

Tab.propTypes = {
  resources: T.shape({
    loaded: T.bool.isRequired,
    data: T.object
  }).isRequired,
  getResourcesData: T.func.isRequired
}

const TabContainer = connect(
  state => ({
    resources: state.resources
  }),
  dispatch => ({
    getResourcesData() {
      dispatch(actions.getResourcesData())
    }
  })
)(Tab)

export {
  TabContainer as ResourcesTab
}
