import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {Vertical} from '#/main/app/content/tabs/components/vertical'

const Nav = () =>
  <Vertical
    tabs={[
      {
        icon: 'fa fa-fw fa-internet-explorer',
        title: trans('domain'),
        path: '/domain'
      }, {
        icon: 'fa fa-fw fa-file-pdf',
        title: trans('pdf'),
        path: '/pdf'
      },  {
        icon: 'fa fa-fw fa-database',
        title: trans('limits'),
        path: '/limits'
      },
      {
        icon: 'fa fa-fw fa-user-shield',
        title: trans('security'),
        path: '/security'
      },
      {
        icon: 'fa fa-fw fa-user',
        title: trans('authentication'),
        path: '/authentication'
      },
      {
        icon: 'fa fa-fw fa-envelope',
        title: trans('mailing'),
        path: '/mailing'
      },
      {
        icon: 'fa fa-fw fa-sign-out-alt',
        title: trans('sessions'),
        path: '/sessions'
      },
      {
        icon: 'fa fa-fw fa-sync',
        title: trans('synchronization'),
        path: '/synchronization'
      }
    ]}
  />


export {
  Nav
}
