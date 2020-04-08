import React from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ContentPlaceholder} from '#/main/app/content/components/placeholder'

import {route} from '#/main/core/resource/routing'
import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'
import {ResourceCard} from '#/main/core/resource/components/card'

// todo embedded option
// todo add resource actions

const ResourceDisplay = (props) => {
  if (!isEmpty(props.data)) {
    return (
      <ResourceCard
        data={props.data}
        size="xs"
        primaryAction={{
          type: LINK_BUTTON,
          label: trans('open', {}, 'actions'),
          target: route(props.data)
        }}
      />
    )
  }

  return (
    <ContentPlaceholder
      icon="fa fa-folder"
      title={trans('no_resource', {}, 'resource')}
    />
  )
}

ResourceDisplay.propTypes = {
  data: T.shape(
    ResourceNodeTypes.propTypes
  ).isRequired
}

export {
  ResourceDisplay
}
