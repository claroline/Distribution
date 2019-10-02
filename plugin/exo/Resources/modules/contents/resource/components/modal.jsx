import React from 'react'
import {PropTypes as T} from 'prop-types'

export const ResourceContentModal = (props) =>
  <div className="resource-content-modal">
  </div>

ResourceContentModal.propTypes = {
  resource: T.object,
  type: T.string.isRequired
}
