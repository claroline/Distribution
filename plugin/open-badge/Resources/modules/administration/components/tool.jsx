import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {TabbedPageContainer} from '#/main/core/layout/tabs'
import {BadgeTabActions, BadgeTab as BadgeTabComponent} from '#/plugin/open-badge/administration/badges/components/badge-tab'

const Tool = () =>
  <TabbedPageContainer
    title={trans('open-badge-management', {}, 'tools')}
    redirect={[
      {from: '/', exact: true, to: '/open-badge'}
    ]}

    tabs={[
      {
        icon: 'fa fa-book',
        title: trans('badges'),
        path: '/badges',
        actions: BadgeTabActions,
        content: BadgeTabComponent
      }, {
        icon: 'fa fa-cog',
        title: trans('parameters'),
        path: '/parameters',
        onlyIcon: true,
        //only for admin
        displayed: true,
        actions: () => {},
        content: () => {}
      }
    ]}
  />

export {
  Tool as OpenBadgeAdminTool
}
