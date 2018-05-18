import React from 'react'
// import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'

const Moderation = () =>
  <div>
    <h2>{trans('moderated_posts', {}, 'forum')}</h2>
  </div>

export {
  Moderation
}
