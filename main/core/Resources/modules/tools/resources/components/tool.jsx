import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'

import {
  PageHeader,
  PageContent
} from '#/main/core/layout/page'
import {
  ToolPageContainer
} from '#/main/core/tool/containers/page'

import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'
import {ResourceExplorer} from '#/main/core/resource/components/explorer'
import {ResourcePageActions} from '#/main/core/resource/components/page-actions'

const Tool = props =>
  <ToolPageContainer>
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
              target: ['claro_resource_action', {resourceType: resourceNode.meta.type, id: resourceNode.id, action: 'open'}]
            }
          } else {
            // changes the target of the list to add current directory in URL
            {/*const fetchUrl = ['apiv2_resource_list', {parent: resourceNode.id}]*/}


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
  </ToolPageContainer>

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
