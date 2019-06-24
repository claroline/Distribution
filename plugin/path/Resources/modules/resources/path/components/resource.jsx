import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Routes} from '#/main/app/router'
import {ResourcePage} from '#/main/core/resource/containers/page'
import {LINK_BUTTON} from '#/main/app/buttons'

import {OverviewMain} from '#/plugin/path/resources/path/overview/containers/main'
import {EditorMain} from '#/plugin/path/resources/path/editor/containers/main'
import {PlayerMain} from '#/plugin/path/resources/path/player/containers/main'
import {DashboardMain} from '#/plugin/path/resources/path/dashboard/containers/main'

const PathResource = props =>
  <ResourcePage
    styles={['claroline-distribution-plugin-path-path-resource']}
    customActions={[
      {
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-home',
        label: trans('show_overview'),
        displayed: props.overview,
        target: props.path,
        exact: true
      }, {
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-play',
        label: trans('start', {}, 'actions'),
        target: `${props.path}/play`
      }, {
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-tachometer',
        label: trans('dashboard'),
        displayed: props.editable,
        target: `${props.path}/dashboard`
      }
    ]}
  >
    <Routes
      path={props.path}
      routes={[
        {
          path: '/edit',
          component: EditorMain,
          disabled: !props.editable
        }, {
          path: '/play',
          component: PlayerMain
        }, {
          path: '/',
          exact: true,
          component: OverviewMain,
          disabled: !props.overview
        }, {
          path: '/dashboard',
          component: DashboardMain,
          disabled: !props.editable
        }
      ]}
      redirect={[
        { // redirect to player when no overview
          disabled: props.overview,
          from: '/',
          to: '/play',
          exact: true
        }
      ]}
    />
  </ResourcePage>

PathResource.propTypes = {
  path: T.string.isRequired,
  editable: T.bool.isRequired,
  overview: T.bool.isRequired
}

export {
  PathResource
}
