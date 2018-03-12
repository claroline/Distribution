import React from 'react'

import {RoutedPageContent} from '#/main/core/layout/router'
import {ResourcePageContainer} from '#/main/core/resource/containers/page.jsx'

import {Player} from '#/plugin/video-player/resources/video/player/components/player.jsx'

const VideoPlayerResource = () => {
  const redirect = []
  const routes = [
    {
      path: '/',
      component: Player
    }
  ]

  return (
    <ResourcePageContainer
      customActions={[]}
    >
      <RoutedPageContent
        headerSpacer={false}
        redirect={redirect}
        routes={routes}
      />
    </ResourcePageContainer>
  )
}

export {
  VideoPlayerResource
}