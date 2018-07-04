import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {selectors as resourceSelect} from '#/main/core/resource/store'
import {hasPermission} from '#/main/core/resource/permissions'
import {RoutedPageContent} from '#/main/core/layout/router/components/page'
import {ResourcePageContainer} from '#/main/core/resource/containers/page'

import {Player} from '#/plugin/scorm/resources/scorm/player/components/player'
import {Results} from '#/plugin/scorm/resources/scorm/player/components/results'

const Resource = props =>
  <ResourcePageContainer
    customActions={[
      {
        type: 'link',
        icon: 'fa fa-fw fa-play',
        label: trans('play_scorm', {}, 'scorm'),
        target: '/play',
        exact: true
      }, {
        type: 'link',
        icon: 'fa fa-fw fa-list',
        label: trans('results_list', {}, 'scorm'),
        disabled: !props.editable,
        displayed: props.editable,
        target: '/results',
        exact: true
      }
    ]}
  >
    <RoutedPageContent
      key="resource-content"
      headerSpacer={true}
      redirect={[
        {from: '/', exact: true, to: '/play'}
      ]}
      routes={[
        {
          path: '/play',
          component: Player
        },
        {
          path: '/results',
          component: Results,
          disabled: !props.editable
        }
      ]}
    />
  </ResourcePageContainer>

Resource.propTypes = {
  editable: T.bool.isRequired
}

const ScormResource = connect(
  (state) => ({
    editable: hasPermission('edit', resourceSelect.resourceNode(state))
  })
)(Resource)

export {
  ScormResource
}
