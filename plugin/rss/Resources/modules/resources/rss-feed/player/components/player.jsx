import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {EmptyPlaceholder} from '#/main/core/layout/components/placeholder'

import {selectors} from '#/plugin/rss/resources/rss-feed/player/store'

const PlayerComponent = props => {
  if (0 === props.items.length) {
    return (
      <EmptyPlaceholder
        size="lg"
        icon="fa fa-image"
        title={trans('no_item', {}, 'rss')}
      />
    )
  }

  return (
    <ul>
      {props.items.map((item, index) =>
        <li key={index}></li>
      )}
    </ul>
  )
}

PlayerComponent.propTypes = {
  items: T.arrayOf(T.shape({
    // TODO
  })).isRequired
}

const Player = connect(
  (state) => ({
    items: selectors.items(state)
  })
)(PlayerComponent)

export {
  Player
}
