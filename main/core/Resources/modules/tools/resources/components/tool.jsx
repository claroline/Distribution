import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Routes} from '#/main/app/router'

import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'
import {ResourceMain} from '#/main/core/resource/containers/main'

const ResourcesTool = props =>
  <Routes
    path={props.path}
    redirect={props.root ? [
      {from: '/', exact: true, to: `/${props.root.id}`}
    ] : undefined}
    routes={[
      {
        path: '/',
        exact: true,
        render: () => {
          return 'empty'
        }
      }, {
        path: '/:id',
        render: (routeProps) => {
          return (
            <ResourceMain
              path={props.path}
              resourceId={routeProps.match.params.id}
            />
          )
        }
      }
    ]}
  />

ResourcesTool.propTypes = {
  path: T.string.isRequired,
  root: T.shape(
    ResourceNodeTypes.propTypes
  ),


  /*contextType: T.string.isRequired,
  current: T.shape(
    ResourceNodeTypes.propTypes
  ),
  loading: T.bool.isRequired,
  addNodes: T.func.isRequired,
  updateNodes: T.func.isRequired,
  deleteNodes: T.func.isRequired*/
}

export {
  ResourcesTool
}
