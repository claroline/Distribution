import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {PageFull} from '#/main/app/page/components/full'

import {Nav} from '#/main/core/administration/parameters/main/components/nav'
import {Settings} from '#/main/core/administration/parameters/main/components/settings'

const Tool = () =>
  <PageFull
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
  </PageFull>


export {
  Tool
}
