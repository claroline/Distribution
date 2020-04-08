import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ContentPlaceholder} from '#/main/app/content/components/placeholder'

import {route} from '#/main/core/workspace/routing'
import {Workspace as WorkspaceType} from '#/main/core/workspace/prop-types'
import {WorkspaceCard} from '#/main/core/workspace/components/card'

const WorkspaceDisplay = (props) => props.data ?
  <WorkspaceCard
    data={props.data}
    size="xs"
    primaryAction={{
      type: LINK_BUTTON,
      label: trans('open', {}, 'actions'),
      target: route(props.data)
    }}
  /> :
  <ContentPlaceholder
    icon="fa fa-book"
    title={trans('no_workspace')}
  />

WorkspaceDisplay.propTypes = {
  data: T.shape(WorkspaceType.propTypes)
}

export {
  WorkspaceDisplay
}
