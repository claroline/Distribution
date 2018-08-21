import React from 'react'
import {PropTypes as T} from 'prop-types'

import {ResourceEmbedded} from '#/main/core/resource/components/embedded'

// todo add placeholder when empty

const ResourceWidget = props =>
  <ResourceEmbedded
    className="step-primary-resource"
    resourceNode={props.resource}
  />

ResourceWidget.propTypes = {

}

export {
  ResourceWidget
}
