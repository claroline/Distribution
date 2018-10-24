import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {Vertical} from '#/main/app/content/tabs/components/vertical'

const Nav = () =>
  <Vertical
    tabs={[
      {
        icon: 'fa fa-fw fa-inbox',
        title: trans('domain'),
        path: '/domain'
      }, {
        icon: 'fa fa-fw fa-paper-plane',
        title: trans('pdf'),
        path: '/pdf'
      },  {
        icon: 'fa fa-fw fa-trash',
        title: trans('limits'),
        path: '/limits'
      },
      {
        icon: 'fa fa-fw fa-trash',
        title: trans('security'),
        path: '/security'
      },
      {
        icon: 'fa fa-fw fa-trash',
        title: trans('authentication'),
        path: '/authentication'
      },
      {
        icon: 'fa fa-fw fa-trash',
        title: trans('mailing'),
        path: '/mailing'
      },
      {
        icon: 'fa fa-fw fa-trash',
        title: trans('indexing'),
        path: '/indexing'
      },
      {
        icon: 'fa fa-fw fa-trash',
        title: trans('sessions'),
        path: '/sessions'
      },
      {
        icon: 'fa fa-fw fa-trash',
        title: trans('synchronization'),
        path: '/synchronization'
      }
    ]}
  />


export {
  Nav
}
