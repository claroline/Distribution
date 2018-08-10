import React from 'react'

import {trans} from '#/main/core/translation'
import {TabbedPageContainer} from '#/main/core/layout/tabs'

// app sections
import {ParametersTab} from '#/plugin/cursus/administration/cursus/parameters/components/parameters-tab'
import {SessionTab, SessionTabActions} from '#/plugin/cursus/administration/cursus/session/components/session-tab'

const CursusTool = props =>
  <TabbedPageContainer
    title={trans('claroline_cursus_tool', {}, 'tools')}
    redirect={[
      {from: '/', exact: true, to: '/sessions'}
    ]}

    tabs={[
      {
        icon: 'fa fa-cubes',
        title: trans('sessions', {}, 'cursus'),
        path: '/sessions',
        actions: SessionTabActions,
        content: SessionTab
      // }, {
      //   icon: 'fa fa-tasks',
      //   title: trans('courses', {}, 'cursus'),
      //   path: '/cursus',
      //   actions: SessionTabActions,
      //   content: SessionTab
      // }, {
      //   icon: 'fa fa-database',
      //   title: trans('cursus', {}, 'cursus'),
      //   path: '/cursus',
      //   actions: SessionTabActions,
      //   content: SessionTab
      // }, {
      //   icon: 'fa fa-clock-o',
      //   title: trans('sessions', {}, 'cursus'),
      //   path: '/cursus',
      //   actions: SessionTabActions,
      //   content: SessionTab
      }, {
        icon: 'fa fa-cog',
        title: trans('parameters'),
        path: '/parameters',
        onlyIcon: true,
        content: ParametersTab
      }
    ]}
  />

export {
  CursusTool
}