import React from 'react'

import {trans} from '#/main/core/translation'
import {Page} from '#/main/app/page/components/page'

import {MessagesNav} from '#/plugin/message/components/messages-nav'
import {Messages} from '#/plugin/message/components/messages'

const Messaging = () =>
  <Page
    title={trans('message', {}, 'tools')}
  >
    <div className="row">
      <div className="col-md-3">
        <MessagesNav/>
      </div>
      <div className="col-md-9">
        <Messages/>
      </div>
    </div>
  </Page>


export {
  Messaging
}
