import React from 'react'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'

import {ResourcePageContainer} from '#/main/core/resource/containers/page.jsx'
import {RoutedPageContent} from '#/main/core/layout/router'

//import {Editor} from '#/plugin/lesson/resources/lesson/editor/components/editor'
import {Player} from '#/plugin/lesson/resources/lesson/player/components/player'

const Resource = props =>
  <ResourcePageContainer
    editor={{
      path: '/edit',
      label: trans('configure', {}, 'platform'),
      save: {
        disabled: !props.saveEnabled,
        action: () => props.saveForm(props.wiki.id)
      }
    }}
    customActions={[
      {
        type: 'link',
        icon: 'fa fa-fw fa-home',
        label: trans('show_overview'),
        target: '/'
      }
    ]}
  >
    <RoutedPageContent
      headerSpacer={false}
      routes={[
        {
          path: '/',
          exact: true,
          component: Player
        }, {
          path: '/edit',
          component: Player,
          canEnter: () => props.canEdit,
          onLeave: () => props.resetForm(),
          onEnter: () => props.resetForm(props.wiki)
        }
      ]}
    />
  </ResourcePageContainer>

const LessonResource = connect(
  state => ({
    lesson: state.lesson
  }),
  () => ({})
)(Resource)

export {
  LessonResource
}