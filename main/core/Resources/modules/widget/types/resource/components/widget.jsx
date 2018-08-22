import React from 'react'
import {PropTypes as T} from 'prop-types'

// import {ResourceEmbedded} from '#/main/core/resource/components/embedded'
import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/data/types/resource/prop-types'



const ResourceWidget = props =>
  <div>{props.resource.name}</div>
  // <ResourceEmbedded
  //   className="step-primary-resource"
  //   resourceNode={props.resource}
  // />

ResourceWidget.propTypes = {
  resource: T.shape(ResourceNodeTypes.propTypes)
}

export {
  ResourceWidget
}
