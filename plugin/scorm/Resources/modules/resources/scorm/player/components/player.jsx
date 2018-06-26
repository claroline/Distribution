import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
// import {Routes} from '#/main/app/router'
// import {currentUser} from '#/main/core/user/current'

// import {select} from '#/plugin/path/resources/path/selectors'


// const authenticatedUser = currentUser()

const PlayerComponent = props =>
  <div className="scorm-iframe">
    Scorm here
  </div>

PlayerComponent.propTypes = {
}

const Player = connect(
  state => ({
    scorm: state.scorm
  })
)(PlayerComponent)

export {
  Player
}
