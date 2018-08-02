import React from 'react'

import {PageContainer} from '#/main/core/layout/page'
import {MessagesNav} from '#/plugin/message/components/messages-nav'
import {Messages} from '#/plugin/message/components/messages'

const Messaging = () =>
  <PageContainer>
    <MessagesNav
    />
    <Messages/>
    <div>puet</div>
  </PageContainer>

export {
  Messaging
}
