import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {TabbedPageContainer} from '#/main/core/layout/tabs'
import {BadgeTab as BadgeTabComponent} from '#/plugin/open-badge/desktop/badges/components/badge-tab'
import {MyBadgeTab as MyBadgeTabComponent} from '#/plugin/open-badge/desktop/badges/components/my-badge-tab'

const Tool = () =>
  <TabbedPageContainer
    title={trans('open-badge-management', {}, 'tools')}
    redirect={[
      {from: '/', exact: true, to: '/my-badges'}
    ]}

    tabs={[
      {
        icon: 'fa fa-user',
        title: trans('my_badges'),
        path: '/my-badges',
        //only for admin
        displayed: true,
        content: MyBadgeTabComponent
      },
      {
        icon: 'fa fa-trophy',
        title: trans('badges'),
        path: '/badges',
        content: BadgeTabComponent
      }
    ]}
  />

export {
  Tool as OpenBadgeDesktopTool
}
