import React from 'react'
import {PropTypes as T} from 'prop-types'
import omit from 'lodash/omit'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {Toolbar} from '#/main/app/action/components/toolbar'
import {MenuSection} from '#/main/app/layout/menu/components/section'

const DashboardMenu = (props) =>
  <MenuSection
    {...omit(props, 'path')}
    title={trans('platform_dashboard', {}, 'tools')}
  >
    <Toolbar
      className="list-group"
      buttonName="list-group-item"
      actions={[
        {
          name: 'analytics',
          type: LINK_BUTTON,
          icon: 'fa fa-fw fa-pie-chart',
          label: trans('analytics_home'),
          target: props.path,
          exact: true
        }, {
          name: 'audience',
          type: LINK_BUTTON,
          icon: 'fa fa-fw fa-line-chart',
          label: trans('user_visit'),
          target: props.path + '/audience'
        }, {
          name: 'resources',
          type: LINK_BUTTON,
          icon: 'fa fa-fw fa-folder',
          label: trans('analytics_resources'),
          target: props.path + '/resources'
        }, {
          name: 'widgets',
          type: LINK_BUTTON,
          icon: 'fa fa-fw fa-list-alt',
          label: trans('widgets'),
          target: props.path + '/widgets',
          displayed: false // TODO : fix app and restore
        }, {
          name: 'top',
          type: LINK_BUTTON,
          icon: 'fa fa-fw fa-sort-amount-desc',
          label: trans('analytics_top'),
          target: props.path + '/top'
        }, {
          name: 'connections',
          type: LINK_BUTTON,
          icon: 'fa fa-fw fa-clock',
          label: trans('connection_time'),
          target: props.path + '/connections'
        }, {
          name: 'log',
          type: LINK_BUTTON,
          icon: 'fa fa-fw fa-users',
          label: trans('users_tracking'),
          target: props.path + '/log'
        }, {
          name: 'logs_users',
          type: LINK_BUTTON,
          icon: 'fa fa-fw fa-user',
          label: trans('user_tracking', {}, 'log'),
          target: props.path + '/logs/users'
        }
      ]}
    />
  </MenuSection>

DashboardMenu.propTypes = {
  path: T.string
}

export {
  DashboardMenu
}
