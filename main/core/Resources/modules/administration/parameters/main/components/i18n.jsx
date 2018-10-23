import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

const I18nComponent = (props) =>
  <div>
    i18n
  </div>


I18nComponent.propTypes = {
}

const I18n = connect(
  null,
  dispatch => ({ })
)(I18nComponent)

export {
  I18n
}
