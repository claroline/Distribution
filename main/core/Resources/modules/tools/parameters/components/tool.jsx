import React from 'react'

import {trans} from '#/main/app/intl/translation'

import {Parameters} from '#/main/core/tools/parameters/components/parameters'
//import {TokenTabActions, TokenTabComponent} from '#/main/core/tools/parameters/token/components/token-tab'
//import {DocumentationCompone
import {PropTypes as T} from 'prop-types'

import {Routes} from '#/main/app/router'
import {ToolPage} from '#/main/core/tool/containers/page'


// TODO : redirect to public list if user is not registered

const ParametersTool = (props) =>
  <ToolPage
    subtitle={
      <Routes
        path={props.path}
        routes={[
          {path: '/parameters', render: () => trans('configuration'), disabled: false}
        ]}
      />
    }
  >
    <Routes
      path={props.path}
      routes={[
        {
          path: '/',
          disabled: false,
          render: () => {
            const Params = <Parameters/>

            return Params
          }
        }]
      }
    />
  </ToolPage>

ParametersTool.propTypes = {
  path: T.string.isRequired
}

export {
  ParametersTool
}
