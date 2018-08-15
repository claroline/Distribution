import React from 'react'

import {trans, transChoice} from '#/main/core/translation'
import {FormData} from '#/main/app/content/form/containers/data'
import {currentUser} from '#/main/core/user/current'

const authenticatedUser = currentUser()

const MessagesParameters = () =>
  <div>
    <h2>{trans('preferences')}</h2>
    <FormData
      level={3}
      displayLevel={2}
      buttons={true}
      // target={}
      name="messagesParameters"
      className="content-container"
      sections={[
        {
          title: trans('general'),
          primary: true,
          fields: [
            {
              name: 'emailNotifications',
              type: 'boolean',
              label: transChoice('get_mail_notifications', authenticatedUser.email, {adress: authenticatedUser.email}),
              required: true
            }
          ]
        }
      ]}
    />
  </div>

export {
  MessagesParameters
}
