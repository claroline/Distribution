import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {selectors} from '#/main/core/resources/text/store'
import {Text as TextTypes} from '#/main/core/resources/text/prop-types'

const PlayerComponent = props =>
  alert(props)

PlayerComponent.propTypes = {
  url: T.shape(TextTypes.propTypes).isRequired
}

const Player = connect(
  state => ({
    url: selectors.url(state)
  })
)(PlayerComponent)

export {
  Player
}
