import React from 'react'

import {trans} from '#/main/core/translation'
import {FormData} from '#/main/app/content/form/containers/data'

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
              label: trans('get_mail_notifications'),
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
