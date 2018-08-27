import React from 'react'
import {PropTypes as T} from 'prop-types'

import {asset} from '#/main/core/scaffolding/asset'

// TODO : replace by SvgIcon from app bundle

const Icon = props =>
  <svg className={`item-icon item-icon-${props.size}`}>
    <use xlinkHref={`${asset('bundles/ujmexo/images/item-icons.svg')}#icon-quiz-${props.name}`} />
  </svg>

Icon.propTypes = {
  name: T.string.isRequired,
  size: T.oneOf(['sm', 'lg'])
}

Icon.defaultProps = {
  size: 'sm'
}

export {Icon}
