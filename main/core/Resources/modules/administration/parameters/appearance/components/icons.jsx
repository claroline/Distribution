import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {FormData} from '#/main/app/content/form/containers/data'

const IconsComponent = (props) =>
  <div>
    En construction
  </div>


IconsComponent.propTypes = {
}

const Icons = connect(
  state => ({
  }),
  null
)(IconsComponent)

export {
  Icons
}
