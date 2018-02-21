import React from 'react'

import {trans} from '#/main/core/translation'
import {DataDetailsContainer} from '#/main/core/data/details/containers/details.jsx'

const LogDetails = () =>
  <DataDetailsContainer
    level={3}
    name="log"
    sections={[
      {
        id: 'general',
        title: trans('general', {}, 'platform'),
        primary: true,
        fields: [
          {
            name: 'date',
            type: 'date',
            label: trans('date'),
            displayed: true,
            primary: true
          }, {
            name: 'action',
            type: 'string',
            label: trans('action'),
            displayed: true
          }, {
            name: 'user',
            type: 'string',
            label: trans('user'),
            displayed: true
          }, {
            name: 'description',
            type: 'string',
            label: trans('description'),
            displayed: true
          }
        ]
      }
    ]}
  />

export {
  LogDetails
}
