import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {select as resourceSelect} from '#/main/core/resource/selectors'
import {RoutedPageContent} from '#/main/core/layout/router'
import {ResourcePageContainer} from '#/main/core/resource/containers/page.jsx'

import {actions as playerActions} from '#/plugin/video-player/resources/video/player/actions'
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
      action: () => props.download(props.resource.autoId)
    })
  }

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
  canDownload: T.bool.isRequired
}

const VideoPlayerResource = connect(
  state => ({
    resource: state.resourceNode,
    canDownload: resourceSelect.exportable(state)
  }),
  (dispatch) => ({
    download: (id) => dispatch(playerActions.download(id))
  })
)(Resource)

export {
  VideoPlayerResource
}