import React from 'react'

import {trans} from '#/main/core/translation'
import {PageContainer} from '#/main/core/layout/page'

import {MessagesNav} from '#/plugin/message/components/messages-nav'
import {Messages} from '#/plugin/message/components/messages'

const Messaging = () =>
  <PageContainer>
    <h2>{trans('mailbox')}</h2>
    <div className="row">
      <div className="col-md-3">
        <MessagesNav/>
      </div>
      <div className="col-md-9">
        <Messages/>
      </div>
    </div>
  </PageContainer>

export {
  Messaging
}
