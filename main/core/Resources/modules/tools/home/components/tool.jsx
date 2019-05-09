import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Routes} from '#/main/app/router'

import {PlayerMain} from '#/main/core/tools/home/player/containers/main'
import {EditorMain} from '#/main/core/tools/home/editor/containers/main'

const HomeTool = props =>
  <Routes
    path={`${props.basePath}`}
    routes={[
      {
        path: '/tab',
        render: () => <PlayerMain basePath={props.basePath} />
      }, {
        path: '/edit/tab',
        disabled: !props.editable,
        render: () => <EditorMain basePath={props.basePath} />
      }
    ]}
    redirect={[
      {from: '/', exact: true, to: '/tab'}
    ]}
  />

HomeTool.propTypes = {
  basePath: T.string.isRequired,
  editable: T.bool.isRequired
}

export {
  HomeTool
}
