import React from 'react'


import {Router, Routes} from '#/main/app/router'

import {ReceivedMessages} from '#/plugin/message/components/received-messages'
import {SentMessages} from '#/plugin/message/components/sent-messages'
import {RemovedMessages} from '#/plugin/message/components/removed-messages'
import {SendMessage} from '#/plugin/message/components/send-message'

const Messages = () =>
  <Router>
    <Routes
      redirect={[
        {from: '/', exact: true, to: '/received' }
      ]}
      routes={[
        {
          path: '/received',
          component: ReceivedMessages
        }, {
          path: '/sent',
          component: SentMessages
        }, {
          path: '/removed',
          component: RemovedMessages
        }, {
          path: '/send',
          component: SendMessage
        }
      ]}
    />
  </Router>



export {
  Messages
}
