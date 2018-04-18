import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {actions} from '#/main/core/administration/analytics/actions'

class Tab extends Component {
  constructor(props) {
    super(props)
    
    if (!props.audience.loaded) {
      props.getAudienceData()
    }
  }
  
  render() {
    return <div>
      Audience Tab
    </div>
  }
}

Tab.propTypes = {
  audience: T.shape({
    loaded: T.bool.isRequired,
    data: T.object
  }).isRequired,
  getAudienceData: T.func.isRequired
}

const TabContainer = connect(
  state => ({
    audience: state.audience
  }),
  dispatch => ({
    getAudienceData() {
      dispatch(actions.getAudienceData())
    }
  })
)(Tab)

export {
  TabContainer as AudienceTab
}