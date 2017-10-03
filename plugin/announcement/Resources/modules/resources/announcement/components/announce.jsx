import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

const AnnounceDetail = props =>
  <div>
    Detail
  </div>

AnnounceDetail.propTypes = {

}

function mapStateToProps(state) {
  return {

  }
}

function mapDispatchToProps(dispatch) {
  return {

  }
}

const Announce = withRouter(connect(mapStateToProps, mapDispatchToProps)(AnnounceDetail))

export {
  Announce
}
