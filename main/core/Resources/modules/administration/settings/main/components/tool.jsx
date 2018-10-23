import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {Page} from '#/main/app/page/components/page'

import {Nav} from '#/main/core/administration/settings/main/components/nav'
import {Settings} from '#/main/core/administration/settings/main/components/settings'

const Tool = () =>
  <Page
    title={trans('main', {}, 'tools')}
  >
    <div className="row">
      <div className="col-md-3">
        <Nav/>
      </div>
      <div className="col-md-9">
        <Settings/>
      </div>
    </div>
  </Page>


export {
  Tool
}
