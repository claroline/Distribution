import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {Vertical} from '#/main/app/content/tabs/components/vertical'

const Nav = () =>
  <Vertical
    tabs={[
      {
        icon: 'fa fa-fw fa-cog',
        title: trans('main'),
        path: '/main'
      }, {
        icon: 'fa fa-fw fa-paper-plane',
        title: trans('portal'),
        path: '/portal'
      },  {
        icon: 'fa fa-fw fa-language',
        title: trans('i18n'),
        path: '/i18n'
      },
      {
        icon: 'fa fa-fw fa-plug',
        title: trans('plugins'),
        path: '/plugins'
      }
    ]}
  />


export {
  Nav
}
