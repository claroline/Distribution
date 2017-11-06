import React from 'react'

import {t} from '#/main/core/translation'
import {TabbedPage, PageTab} from '#/main/core/layout/page/components/tabbed-page.jsx'

// app sections
import {ParametersTab, ParametersTabActions} from '#/main/core/administration/user/parameters/components/parameters-tab.jsx'
import {UserTab, UserTabActions} from '#/main/core/administration/user/user/components/user-tab.jsx'
import {GroupTab, GroupTabActions} from '#/main/core/administration/user/group/components/group-tab.jsx'
import {RoleTab, RoleTabActions} from '#/main/core/administration/user/role/components/role-tab.jsx'
import {OrganizationTab, OrganizationTabActions} from '#/main/core/administration/user/organization/components/organization-tab.jsx'
import {ProfileTab, ProfileTabActions} from '#/main/core/administration/user/profile/components/profile-tab.jsx'
import {LocationTab, LocationTabActions} from '#/main/core/administration/user/location/components/location-tab.jsx'

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
        icon: 'fa fa-user',
        title: t('users'),
        path: '/users',
        actions: UserTabActions,
        content: UserTab
      }, {
        icon: 'fa fa-users',
        title: t('groups'),
        path: '/groups',
        actions: GroupTabActions,
        content: GroupTab
      }, {
        icon: 'fa fa-id-badge',
        title: t('roles'),
        path: '/roles',
        actions: RoleTabActions,
        content: RoleTab
      }, {
        icon: 'fa fa-building',
        title: t('organizations'),
        path: '/organizations',
        actions: OrganizationTabActions,
        content: OrganizationTab
      }, {
        icon: 'fa fa-location-arrow',
        title: t('locations'),
        path: '/locations',
        actions: LocationTabActions,
        content: LocationTab
      }, {
        icon: 'fa fa-id-card-o',
        title: t('user_profile'),
        path: '/profile',
        actions: ProfileTabActions,
        content: ProfileTab
      }
    ]}
  />

export {
  UserMain
}
