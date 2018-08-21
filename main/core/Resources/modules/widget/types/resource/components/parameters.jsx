import React from 'react'

import {trans} from '#/main/core/translation'
import {FormData} from '#/main/app/content/form/containers/data'

const ResourceWidgetParameters = (props) =>
  <FormData
    embedded={true}
    level={5}
    name={props.name}
    sections={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'parameters.resource',
            label: trans('content'),
            type: 'resource',
            required: true
          }
        ]
      }
    ]}
  />

export {
  ResourceWidgetParameters
}
