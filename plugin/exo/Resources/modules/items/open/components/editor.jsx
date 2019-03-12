import React from 'react'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {tex} from '#/main/app/intl/translation'
import {FormData} from '#/main/app/content/form/containers/data'
import {ItemEditor as ItemEditorTypes} from '#/plugin/exo/items/prop-types'

export const OpenEditor = (props) => {
  <FormData
    className="choice-item choice-editor"
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
            name: 'maxScore',
            type: 'number',
            label: tex('maxLength'),
            required: true
          }
        ]
      }
    ]}
  />
}

implementPropTypes(OpenEditor, ItemEditorTypes, {
  item: T.shape({
    // TODO : choice item type
    multiple: T.bool
  }).isRequired
})
