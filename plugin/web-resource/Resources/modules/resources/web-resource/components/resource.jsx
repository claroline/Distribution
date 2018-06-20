import React from 'react'

import {RoutedPageContent} from '#/main/core/layout/router'



import {ResourcePageContainer} from '#/main/core/resource/containers/page'
import {Player} from '#/main/core/resources/text/player/components/player'


const WebResource = () =>
  <ResourcePageContainer
    editor={{
      path: '/edit'
    }}
  >
    <RoutedPageContent
      headerSpacer={true}
      routes={[
        {
          path: '/',
          exact: true,
          component: Player
        }, {
          path: '/edit',
          component: Player
        }
      ]}
    />
  </ResourcePageContainer>


export {
  WebResource
}
