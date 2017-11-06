import React from 'react'

import {t} from '#/main/core/translation'
import {SectionedPage} from '#/main/core/layout/page/components/sectioned-page.jsx'

// app sections
import {Parameters} from '#/main/core/administration/user/parameters/components/parameters.jsx'
import {Users} from '#/main/core/administration/user/user/components/users.jsx'
import {Groups} from '#/main/core/administration/user/group/components/groups.jsx'
import {Roles} from '#/main/core/administration/user/role/components/roles.jsx'
import {Organizations} from '#/main/core/administration/user/organization/components/organizations.jsx'
import {Profile} from '#/main/core/administration/user/profile/components/profile.jsx'
import {Locations} from '#/main/core/administration/user/locations/components/locations.jsx'

const UserMain = props =>
  <SectionedPage
    actions={[]}
    sections={[
      {
        path: '/',
        exact: true,
        icon: 'fa fa-cog',
        title: t('parameters'),
        actions: [],
        component: Parameters
      }, {
        path: '/users',
        icon: 'fa fa-user',
        title: t('users'),
        actions: [
          {
            icon: 'fa fa-plus',
            label: t('add_user'),
            action: '/users/add',
            primary: true
          }, {
            icon: 'fa fa-download',
            label: t('import_users'),
            action: '/users/import'
          }
        ],
        component: Users
      }, {
        path: '/groups',
        icon: 'fa fa-users',
        title: t('groups'),
        actions: [
          {
            icon: 'fa fa-plus',
            label: t('add_group'),
            action: '/groups/add',
            primary: true
          }, {
            icon: 'fa fa-download',
            label: t('import_groups'),
            action: '/groups/import'
          }
        ],
        component: Groups
      }, {
        path: '/roles',
        icon: 'fa fa-id-badge',
        title: t('roles'),
        actions: [
          {
            icon: 'fa fa-plus',
            label: t('add_role'),
            action: '/roles/add',
            primary: true
          }, {
            icon: 'fa fa-download',
            label: t('import_roles'),
            action: '/roles/import'
          }
        ],
        component: Roles
      }, {
        path: '/organizations',
        icon: 'fa fa-building',
        title: t('organizations'),
        actions: [
          {
            icon: 'fa fa-plus',
            label: t('add_organization'),
            action: '/organizations/add',
            primary: true
          }, {
            icon: 'fa fa-download',
            label: t('import_roles'),
            action: '/roles/import'
          }
        ],
        component: Organizations
      }, {
        path: '/locations',
        icon: 'fa fa-location-arrow',
        title: t('locations'),
        actions: [
          {
            icon: 'fa fa-plus',
            label: t('add_location'),
            action: '/locations/add',
            primary: true
          }
        ],
        component: Locations
      },{
        path: '/profile',
        icon: 'fa fa-id-card-o',
        title: t('user_profile'),
        actions: [],
        component: Profile
      }
    ]}
  />

export {
  UserMain
}
