import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {Vertical} from '#/main/app/content/tabs/components/vertical'

const Nav = () =>
  <Vertical
    tabs={[
      {
        icon: 'fa fa-fw fa-inbox',
        title: trans('main'),
        path: '/main'
      }, {
        icon: 'fa fa-fw fa-paper-plane',
        title: trans('icons'),
        path: '/icons'
      },  {
        icon: 'fa fa-fw fa-trash',
        title: trans('themes'),
        path: '/themes'
      }
    ]}
  />


export {
  Nav
}
