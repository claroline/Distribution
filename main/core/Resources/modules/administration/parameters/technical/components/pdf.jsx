import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

const PdfComponent = (props) =>
  <div>
    MAIN
  </div>


PdfComponent.propTypes = {
}

const Pdf = connect(
  null,
  dispatch => ({ })
)(PdfComponent)

export {
  Pdf
}
