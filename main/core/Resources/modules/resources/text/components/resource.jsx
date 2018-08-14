import React from 'react'

import {trans} from '#/main/core/translation'
import {RoutedPageContent} from '#/main/core/layout/router'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ResourcePage} from '#/main/core/resource/containers/page'

import {Player} from '#/main/core/resources/text/player/components/player'
import {Editor} from '#/main/core/resources/text/editor/components/editor'

const TextResource = props =>
  <ResourcePage>
    <RoutedPageContent
      headerSpacer={true}
      routes={[
        {
          path: '/',
          component: Player,
          exact: true
        }, {
          path: '/edit',
          component: Editor
        }
      ]}
    />
  </ResourcePage>

export {
  TextResource
}
