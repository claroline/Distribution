import React from 'react'

import {trans} from '#/main/core/translation'
import {FormContainer} from '#/main/core/data/form/containers/form.jsx'

const WikiSectionForm = () =>
  <FormContainer
    level={3}
    name="currentSection"
    sections={[
      {
        icon: 'fa fa-fw fa-cog',
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'activeContribution.title',
            type: 'string',
            label: trans('title'),
            required: true
          }, {
            name: 'activeContribution.text',
            type: 'html',
            label: trans('text'),
            required: true,
            options: {
              min: 1
            }
          }
        ]
      }
    ]}
  />

export {
  WikiSectionForm
}

  