import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

const MailingComponent = (props) =>
  <div>
    Mailing
  </div>


MailingComponent.propTypes = {
}

const Mailing = connect(
  null,
  dispatch => ({ })
)(MailingComponent)

export {
  Mailing
}
