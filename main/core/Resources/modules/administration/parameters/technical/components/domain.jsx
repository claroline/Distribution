import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

const DomainComponent = (props) =>
  <div>
    i18n
  </div>


DomainComponent.propTypes = {
}

const Domain = connect(
  null,
  dispatch => ({ })
)(DomainComponent)

export {
  Domain
}
