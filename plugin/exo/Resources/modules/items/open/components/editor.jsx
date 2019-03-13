import React from 'react'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {tex, trans} from '#/main/app/intl/translation'

import {FormData} from '#/main/app/content/form/containers/data'
import {ItemEditor as ItemEditorTypes} from '#/plugin/exo/items/prop-types'
import {OpenItem} from '#/plugin/exo/items/open/prop-types'

export const OpenEditor = (props) => 
  <FormData
    className="open-editor"
    embedded={true}
    name={props.formName}
    dataPart={props.path}
    sections={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'maxScore',
            type: 'number',
            label: tex('score_max'),
            required: true
          },
          {
            name: 'maxLength',
            type: 'number',
            label: tex('max_length'),
            required: true
          }
        ]
      }
    ]}
  />

implementPropTypes(OpenEditor, ItemEditorTypes, {
  item: T.shape(OpenItem.propTypes).isRequired
})
