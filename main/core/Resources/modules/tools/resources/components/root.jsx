import React from 'react'
import {PropTypes as T} from 'prop-types'
import merge from 'lodash/merge'

import {ListSource} from '#/main/app/content/list/containers/source'
import {ToolPage} from '#/main/core/tool/containers/page'
import {getActions, getDefaultAction} from '#/main/core/resource/utils'

import resourcesSource from '#/main/core/data/sources/resources'
import {Directory as DirectoryTypes} from '#/main/core/resources/directory/prop-types'

const ResourcesRoot = props =>
  <ToolPage>
    <ListSource
      name={props.listName}
      fetch={{
        url: ['apiv2_resource_list'],
        autoload: true
      }}
      source={merge({}, resourcesSource, {
        // adds actions to source
        parameters: {
          primaryAction: (resourceNode) => getDefaultAction(resourceNode, {
            update: props.updateNodes,
            delete: props.deleteNodes
          }, props.path),
          actions: (resourceNodes) => getActions(resourceNodes, {
            update: props.updateNodes,
            delete: props.deleteNodes
          }, props.path)
        }
      })}
      parameters={DirectoryTypes.defaultProps.list}
    />
  </ToolPage>

ResourcesRoot.propTypes = {
  path: T.string.isRequired,
  listName: T.string.isRequired,
  updateNodes: T.func.isRequired,
  deleteNodes: T.func.isRequired
}

export {
  ResourcesRoot
}
