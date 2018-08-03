import React from 'react'


import {Router, Routes} from '#/main/app/router'

import {ReceivedMessages} from '#/plugin/message/components/received-messages'
import {SentMessages} from '#/plugin/message/components/sent-messages'
import {DeletedMessages} from '#/plugin/message/components/deleted-messages'
import {NewMessage} from '#/plugin/message/components/new-message'
import {Message} from '#/plugin/message/components/message'

const Messages = () =>
  <Router>
    <Routes
      redirect={[
        {from: '/', exact: true, to: '/received' }
      ]}
      routes={[
        {
          path: '/received',
          exact: true,
          component: ReceivedMessages
        }, {
          path: '/sent',
          exact: true,
          component: SentMessages
        }, {
          path: '/deleted',
          exact: true,
          component: DeletedMessages
        }, {
          path: '/new',
          exact: true,
          component: NewMessage
        }, {
          path: '/message/:id?',
          exact: true,
          component: Message
        }
      ]}
    />
  </Router>



export {
  Messages
}
