import React, { Component } from 'react'

import {asset} from '#/main/core/asset/index'

const T = React.PropTypes

export default class ItemIcon extends Component {
  render() {
    return (
      <svg className={`item-icon item-icon-${this.props.size}`}>
        <use xlinkHref={`${asset('/Claroline/web/bundles/ujmexo/images/item-icons.svg')}#icon-${this.props.name}`} />
      </svg>
    )
  }
}

ItemIcon.propTypes = {
  name: T.string.isRequired,
  size: T.oneOf(['sm', 'lg'])
}

ItemIcon.defaultProps = {
  size: 'sm'
}
