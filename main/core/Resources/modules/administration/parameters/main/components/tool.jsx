import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'
import {ToolPage} from '#/main/core/tool/containers/page'

import {Home} from '#/main/core/administration/parameters/main/components/home'
import {Archive} from '#/main/core/administration/parameters/main/components/archive'
import {Meta} from '#/main/core/administration/parameters/main/components/meta'
import {I18n} from '#/main/core/administration/parameters/main/components/i18n'
import {Plugins} from '#/main/core/administration/parameters/main/components/plugins'
import {Maintenance} from '#/main/core/administration/parameters/main/components/maintenance'

const ParametersTool = (props) =>
  <ToolPage
    subtitle={
      <Routes
        path={props.path}
        routes={[
          {path: '/', exact: true, render: () => trans('information')},
          {path: '/home',          render: () => trans('home')},
          {path: '/i18n',          render: () => trans('language')},
          {path: '/plugins',       render: () => trans('plugins')},
          {path: '/maintenance',   render: () => trans('maintenance')},
          {path: '/archives',      render: () => trans('archive')}
        ]}
      />
    }
  >
    <Routes
      path={props.path}
      routes={[
        {
          path: '/',
          exact: true,
          component: Meta
        }, {
          path: '/home',
          component: Home
        }, {
          path: '/i18n',
          component: I18n
        }, {
          path: '/plugins',
          component: Plugins
        }, {
          path: '/maintenance',
          component: Maintenance
        }, {
          path: '/archives',
          component: Archive
        }
      ]}
    />
  </ToolPage>

ParametersTool.propTypes = {
  path: T.string.isRequired
}

export {
  ParametersTool
}
