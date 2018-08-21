import React from 'react'
import {PropTypes as T} from 'prop-types'

import {ResourceEmbedded} from '#/main/core/resource/components/embedded'
import {rRsourceNode as ResourceNodeTypes} from '#/main/core/resource/data/types/resource/prop-types'

// todo add placeholder when empty

const ResourceWidget = props =>
  <ResourceEmbedded
    className="step-primary-resource"
    resourceNode={props.resource}
  />

ResourceWidget.propTypes = {
  // resource: T.shape(ResourceNodeTypes.propTypes)
}

export {
  ResourceWidget
}
