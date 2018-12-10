import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {TabbedPageContainer} from '#/main/core/layout/tabs'
import {BadgeTabActions, BadgeTab as BadgeTabComponent} from '#/plugin/open-badge/workspace/badges/components/badge-tab'

const Tool = () =>
  <TabbedPageContainer
    title={trans('open-badge-management', {}, 'tools')}
    redirect={[
      {from: '/', exact: true, to: '/badges'}
    ]}

    tabs={[
      {
        icon: 'fa fa-trophy',
        title: trans('badges'),
        path: '/badges',
        actions: BadgeTabActions,
        content: BadgeTabComponent
      }
    ]}
  />

export {
  Tool as OpenBadgeWorkspaceTool
}
