import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'
import {ToolPage} from '#/main/core/tool/containers/page'

import {ToolsTool} from '#/main/core/tools/parameters/tools/containers/tool'
// TODO : make it dynamic
import {ExternalTool} from '#/main/core/tools/parameters/external/components/tool'
import {TokensTool} from '#/main/core/tools/parameters/tokens/containers/tool'

const ParametersTool = (props) =>
  <Routes
    path={props.path}
    routes={[
      {
        path: '/',
        exact: true,
        component: ToolsTool
      }, {
        path: '/external',
        exact: true,
        component: ExternalTool
      }, {
        path: '/tokens',
        exact: true,
        component: TokensTool
      }
    ]}
  />

ParametersTool.propTypes = {
  path: T.string.isRequired
}

export {
  ParametersTool
}
