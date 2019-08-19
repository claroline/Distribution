import React from 'react'

import {LINK_BUTTON} from '#/main/app/buttons'
import {ToolPage} from '#/main/core/tool/containers/page'
import {Routes} from '#/main/app/router'
import {selectors}  from '#/plugin/open-badge/tools/badges/store/selectors'

import {trans} from '#/main/app/intl/translation'
import {ParametersForm} from '#/plugin/open-badge/tools/badges/parameters/components/parameters'
import {Badge}  from '#/plugin/open-badge/tools/badges/badge/components/badge'
import {Badges}  from '#/plugin/open-badge/tools/badges/badge/components/list'
/*
url: props.currentContext === 'workspace' ? ['apiv2_badge-class_workspace_badge_list', {workspace: props.workspace.uuid}]: ['apiv2_badge-class_list'],
autoload: true*/

const Tool = props =>
  <ToolPage
    actions={[
      {
        name: 'new',
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-plus',
        label: trans('add_badge', {}),
        target: `${props.path}/new`,
        primary: true,
        //only for organizationManager
        displayed: true
      }
    ]}
    subtitle={
      <Routes
        path={props.path}
        routes={[
          {path: '/new',        render: () => trans('add_badge', {} ), disabled: false},
          {path: '/my-badges', render: () => trans('my_badges', {} )},
          {path: '/badges',     render: () => trans('badges', {})},
          {path: '/parameters',    render: () => trans('parameters', {})},
          {path: '/profile/:id',      render: () => trans('profile', {})}
        ]}
      />
    }
  >
    <Routes
      path={props.path}
      routes={[
        {
          path: '/new',
          disabled: false,
          component: Badge
        }, {
          path: '/my-badges',
          render: () => {
            const MyBadges = (
              <Badges
                url={['apiv2_assertion_current_user_list']}
                name={selectors.STORE_NAME + '.badges.mine'}
              />
            )

            return MyBadges
          }
        }, {
          path: '/badges',
          render: () => {
            const AllBadges = (
              <Badges
                url={props.currentContext === 'workspace' ? ['apiv2_badge-class_workspace_badge_list', {workspace: props.workspace.uuid}]: ['apiv2_badge-class_list']}
                name={selectors.STORE_NAME +'.badges.list'}
              />
            )

            return AllBadges
          }
        }, {
          path: '/parameters',
          component: ParametersForm
        }
      ]}

      redirect={[
        {from: '/', exact: true, to: '/badges', disabled: !props.authenticated}
      ]}
    />
  </ToolPage>

export {
  Tool
}
