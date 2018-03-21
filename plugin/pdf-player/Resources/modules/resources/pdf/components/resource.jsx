import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {generateUrl} from '#/main/core/api/router'
import {trans} from '#/main/core/translation'
import {copyToClipboard} from '#/main/core/copy-text-to-clipboard'
import {select as resourceSelect} from '#/main/core/resource/selectors'
import {RoutedPageContent} from '#/main/core/layout/router'
import {ResourcePageContainer} from '#/main/core/resource/containers/page.jsx'

import {Player} from '#/plugin/pdf-player/resources/pdf/player/components/player.jsx'

const Resource = props => {
  const routes = [
    {
      path: '/play',
      component: Player
    }
  ]
  const redirect = [{
    from: '/',
    to: '/play',
    exact: true
  }]
  const customActions = [
    {
      icon: 'fa fa-fw fa-download',
      label: trans('download'),
      displayed: props.canDownload,
      action: () => window.location = generateUrl('claro_resource_download') + '?ids[]=' + props.resource.autoId
    }, {
      icon: 'fa fa-fw fa-clipboard',
      label: trans('copy_permalink_to_clipboard'),
      action: () => copyToClipboard(props.url)
    }
  ]

  return (
    <ResourcePageContainer
      customActions={customActions}
    >
      <RoutedPageContent
        headerSpacer={false}
        redirect={redirect}
        routes={routes}
      />
    </ResourcePageContainer>
  )
}

Resource.propTypes = {
  resource: T.shape({
    id: T.string.isRequired,
    autoId: T.number.isRequired
  }).isRequired,
  url: T.string.isRequired,
  canDownload: T.bool.isRequired
}

const PdfPlayerResource = connect(
  state => ({
    resource: state.resourceNode,
    url: state.url,
    canDownload: resourceSelect.exportable(state)
  })
)(Resource)

export {
  PdfPlayerResource
}