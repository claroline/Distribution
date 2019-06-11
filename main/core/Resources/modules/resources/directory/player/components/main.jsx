import React from 'react'
import {PropTypes as T} from 'prop-types'
import merge from 'lodash/merge'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {getActions} from '#/main/core/resource/utils'
import {ListSource} from '#/main/app/content/list/containers/source'
import {ListParameters as ListParametersTypes} from '#/main/app/content/list/parameters/prop-types'
import resourcesSource from '#/main/core/data/sources/resources'

// TODO : fix reloading at resource creation

const PlayerMain = props =>
  <ListSource
    name={props.listName}
    fetch={{
      url: ['apiv2_resource_list', {parent: props.id}],
      autoload: true
    }}
    source={merge({}, resourcesSource, {
      // adds actions to source
      parameters: {
        primaryAction: (resourceNode) => ({
          label: trans('open', {}, 'actions'),
          type: LINK_BUTTON,
          target: `${props.path}/${resourceNode.id}`
        }),
        //actions: props.actions || () => []
      }
    })}
    parameters={props.listConfiguration}
  />

PlayerMain.propTypes = {
  path: T.string,
  listName: T.string.isRequired,
  id: T.string,
  listConfiguration: T.shape(
    ListParametersTypes.propTypes
  )
}

export {
  PlayerMain
}
