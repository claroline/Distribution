import React from 'react'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'

import {ResourcePageContainer} from '#/main/core/resource/containers/page.jsx'

const Resource = () =>
  <ResourcePageContainer>
      editor={{
      path: '/add',
      icon: 'fa fa-plus',
      label: trans('add_announce', {}, 'announcement'),
      save: {
        disabled: false,
        action: () => {}
      }
    }}
      customActions={[
      {
        type: 'link',
        icon: 'fa fa-fw fa-list',
        label: trans('announcements_list', {}, 'announcement'),
        target: '/'
      }
    ]}
  </ResourcePageContainer>

const LessonResource = connect(
  () => ({}),
  () => ({})
)(Resource)

export {
  LessonResource
}