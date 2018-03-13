import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {generateUrl} from '#/main/core/api/router'
import {trans} from '#/main/core/translation'
import {copyToClipboard} from '#/main/core/copy-text-to-clipboard'
import {select as resourceSelect} from '#/main/core/resource/selectors'
import {RoutedPageContent} from '#/main/core/layout/router'
import {ResourcePageContainer} from '#/main/core/resource/containers/page.jsx'

import {Player} from '#/plugin/video-player/resources/video/player/components/player.jsx'

const Resource = props => {
  const routes = [
    {
      path: '/',
      component: Player
    }
  ]
  const customActions = []

  if (props.canDownload) {
    customActions.push({
      icon: 'fa fa-fw fa-download',
      label: trans('download'),
      action: () => window.location = generateUrl('claro_resource_download') + '?ids[]=' + props.resource.autoId
    })
  }
  customActions.push({
    icon: 'fa fa-fw fa-clipboard',
    label: trans('copy_permalink_to_clipboard'),
    action: () => copyToClipboard(props.url)
  })

  return (
    <ResourcePageContainer
      customActions={customActions}
    >
      <RoutedPageContent
        headerSpacer={false}
        redirect={[]}
        routes={routes}
      />
    </ResourcePageContainer>
  )
}

Resource.propTypes = {
  resource: T.shape({
    autoId: T.number.isRequired
  }).isRequired,
  url: T.string.isRequired,
  canDownload: T.bool.isRequired
}

const VideoPlayerResource = connect(
  state => ({
    resource: state.resourceNode,
    url: state.url,
    canDownload: resourceSelect.exportable(state)
  })
)(Resource)

export {
  VideoPlayerResource
}