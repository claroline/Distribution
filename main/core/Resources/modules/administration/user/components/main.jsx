import React from 'react'

import {t} from '#/main/core/translation'
import {TabbedPage, PageTab} from '#/main/core/layout/page/components/tabbed-page.jsx'

// app sections
import {ParametersTab, ParametersTabActions} from '#/main/core/administration/user/parameters/components/parameters-tab.jsx'
import {UserSection} from '#/main/core/administration/user/user/components/user-section.jsx'
import {GroupTab, GroupTabActions} from '#/main/core/administration/user/group/components/group-tab.jsx'
import {RoleSection} from '#/main/core/administration/user/role/components/role-section.jsx'
import {OrganizationSection} from '#/main/core/administration/user/organization/components/organization-section.jsx'
import {ProfileSection} from '#/main/core/administration/user/profile/components/profile-section.jsx'

const UserMain = props =>
  <TabbedPage
    tabs={[
      {
        icon: 'fa fa-cog',
        title: t('parameters'),
        path: '/',
        exact: true,
        actions: ParametersTabActions,
        content: ParametersTab
      }, {
        icon: 'fa fa-users',
        title: t('groups'),
        path: '/groups',
        actions: GroupTabActions,
        content: GroupTab
      }
    ]}
  />

export {
  UserMain
}
