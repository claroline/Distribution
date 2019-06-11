import React from 'react'
import {PropTypes as T} from 'prop-types'
import merge from 'lodash/merge'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ListSource} from '#/main/app/content/list/containers/source'
import {ListParameters as ListParametersTypes} from '#/main/app/content/list/parameters/prop-types'

import resourcesSource from '#/main/core/data/sources/resources'

const ResourcesRoot = props =>
  <ToolPage>
    <ListSource
      name={`${props.name}.resources`}
      fetch={{
        url: ['apiv2_resource_list'],
        autoload: false
      }}
      source={merge({}, resourcesSource, {
        // adds actions to source
        parameters: {
          /*primaryAction: (resourceNode) => {
            if ('directory' !== resourceNode.meta.type) {
              return props.primaryAction && props.primaryAction(resourceNode)
            } else {
              // do not open directory, just change the target of the explorer
              return {
                label: trans('open', {}, 'actions'),
                type: LINK_BUTTON,
                target: `${props.basePath}/${resourceNode.id}`
              }
            }
          },
          actions: props.actions*/
        }
      })}
    />
  </ToolPage>

ResourcesRoot.propTypes = {

}

export {
  ResourcesRoot
}
