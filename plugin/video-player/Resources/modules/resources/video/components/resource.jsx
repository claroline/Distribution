import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {url} from '#/main/core/api/router'
import {trans} from '#/main/core/translation'
import {copyToClipboard} from '#/main/core/copy-text-to-clipboard'
import {select as resourceSelect} from '#/main/core/resource/selectors'
import {RoutedPageContent} from '#/main/core/layout/router'
import {ResourcePageContainer} from '#/main/core/resource/containers/page'

import {Player} from '#/plugin/video-player/resources/video/player/components/player'
import {MODAL_VIDEO_SUBTITLES} from '#/plugin/video-player/resources/video/editor/components/modal/subtitles'

const Resource = props =>
  <ResourcePageContainer
    customActions={[
      {
        type: 'modal',
        icon: 'fa fa-fw fa-list',
        label: trans('subtitles'),
        displayed: props.canEdit,
        modal: [MODAL_VIDEO_SUBTITLES]
      },{
        type: 'download',
        icon: 'fa fa-fw fa-download',
        label: trans('download'),
        displayed: props.canDownload,
        file: {
          url: url(['claro_resource_download'], {ids: [props.resource.autoId]})
        }
      }, {
        type: 'callback',
        icon: 'fa fa-fw fa-clipboard',
        label: trans('copy_permalink_to_clipboard'),
        callback: () => copyToClipboard(props.url)
      }
    ]}
  >
    <RoutedPageContent
      headerSpacer={true}
      redirect={[
        {from: '/', exact: true, to: '/play'}
      ]}
      routes={[
        {
          path: '/play',
          component: Player
        }
      ]}
    />
  </ResourcePageContainer>

Resource.propTypes = {
  resource: T.shape({
    id: T.string.isRequired,
    autoId: T.number.isRequired
  }).isRequired,
  url: T.string.isRequired,
  canEdit: T.bool.isRequired,
  canDownload: T.bool.isRequired,
  showModal: T.func.isRequired
}

const VideoPlayerResource = connect(
  state => ({
    resource: state.resourceNode,
    url: state.url,
    canEdit: resourceSelect.editable(state),
    canDownload: resourceSelect.exportable(state)
  })
)(Resource)

export {
  VideoPlayerResource
}