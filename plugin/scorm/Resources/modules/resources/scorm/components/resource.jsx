import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {selectors as resourceSelect} from '#/main/core/resource/store'
import {hasPermission} from '#/main/core/resource/permissions'
import {RoutedPageContent} from '#/main/core/layout/router/components/page'
import {ResourcePageContainer} from '#/main/core/resource/containers/page'

import {Player} from '#/plugin/scorm/resources/scorm/player/components/player'

const Resource = props =>
  <ResourcePageContainer
    editor={{
      path: '/edit',
      save: {
        disabled: false,
        action: () => {}
      }
    }}
    customActions={[]}
  >
    <RoutedPageContent
      key="resource-content"
      headerSpacer={true}
      redirect={[
        {from: '/', exact: true, to: '/play'}
      ]}
      routes={[
        {
          path: '/',
          exact: true,
          component: Player
        }, {
          path: '/edit',
          component: Player
        }, {
          path: '/play',
          component: Player
        }
      ]}
    />
  </ResourcePageContainer>

Resource.propTypes = {
  canEdit: T.bool.isRequired,
  scorm: T.object.isRequired
}

const ScormResource = connect(
  (state) => ({
    canEdit: hasPermission('edit', resourceSelect.resourceNode(state)),
    scorm: state.scorm
  })
)(Resource)

export {
  ScormResource
}
