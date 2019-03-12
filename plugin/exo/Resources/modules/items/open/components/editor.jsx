import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'
import {actions} from './editor'
import {tex} from '#/main/app/intl/translation'
import {FormGroup} from '#/main/app/content/form/components/group.jsx'
import {FormData} from '#/main/app/content/form/containers/data'

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
