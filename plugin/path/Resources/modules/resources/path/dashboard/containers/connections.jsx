import React from 'react'
import {connect} from 'react-redux'

import {selectors as resourceSelectors} from '#/main/core/resource/store'

import {Connections as ConnectionsComponent} from '#/plugin/path/resources/path/dashboard/components/connections'

const Connections = connect(
  state => ({
    resourceId: resourceSelectors.resourceNode(state).autoId
  })
)(ConnectionsComponent)

export {
  Connections
}
