import React from 'react'

import {RoutedPageContent} from '#/main/core/layout/router'

import {ResourcePage} from '#/main/core/resource/containers/page'
import {Player} from '#/main/core/resources/text/player/components/player'
import {Editor} from '#/main/core/resources/text/editor/components/editor'

const DirectoryResource = props =>
  <ResourcePage>
    <RoutedPageContent
      headerSpacer={true}
      routes={[
        {
          path: '/',
          exact: true,
          component: Player
        }, {
          path: '/edit',
          component: Editor
        }
      ]}
    />
  </ResourcePage>

export {
  DirectoryResource
}