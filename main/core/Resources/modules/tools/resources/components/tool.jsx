import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'

import {
  PageAction,
  PageActions,
  PageHeader,
  PageContent
} from '#/main/core/layout/page'
import {
  RoutedPageContainer
} from '#/main/core/layout/router'

import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'
import {ResourceExplorer} from '#/main/core/resource/components/explorer'
import {ResourcePageActions} from '#/main/core/resource/components/page-actions'

const Tool = props =>
  <RoutedPageContainer>
    <PageHeader
      title={trans('resources', {}, 'tools')}
      subtitle={props.current && props.current.name}
    >
      {props.current &&
        <ResourcePageActions
          resourceNode={props.current}

          fullscreen={false}
          toggleFullscreen={() => true}
          togglePublication={() => true}
          toggleNotifications={() => true}
          updateNode={() => true}
        />
      }
    </PageHeader>

    <PageContent>
      <ResourceExplorer
        root={props.root}
        current={props.current}
        primaryAction={(resourceNode) => {
          let action
          if ('directory' !== resourceNode.meta.type) {
            action = {
              label: trans('open', {}, 'actions'),
              type: 'url',
              target: ['claro_resource_open', {node: resourceNode.id, resourceType: resourceNode.meta.type}]
            }
          } else {
            // changes the target of the list to add current directory in URL
            const fetchUrl = ['apiv2_resource_list', {parent: resourceNode.id}]


            action = {
              label: trans('open', {}, 'actions'),
              type: 'callback',
              callback: () => true
            }
          }

          return action
        }}
      />
    </PageContent>
  </RoutedPageContainer>

Tool.propTypes = {
  root: T.shape(
    ResourceNodeTypes.propTypes
  ),
  current: T.shape(
    ResourceNodeTypes.propTypes
  )
}

const ResourcesTool = connect(
  state => ({
    root: state.root,
    current: state.current
  })
)(Tool)

export {
  ResourcesTool
}
