import React from 'react'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {trans} from '#/main/app/intl/translation'
import {FormData} from '#/main/app/content/form/containers/data'

import {ItemEditor as ItemEditorTypes} from '#/plugin/exo/items/prop-types'

import {WaveformItem as WaveformItemType} from '#/plugin/audio-player/quiz/items/waveform/prop-types'

const WaveformEditor = (props) =>
  <FormData
    className="waveform-editor"
    embedded={true}
    name={props.formName}
    dataPart={props.path}
    sections={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          // {
          //   name: 'contentType',
          //   label: trans('expected_answer', {}, 'quiz'),
          //   type: 'choice',
          //   required: true,
          //   options: {
          //     noEmpty: true,
          //     condensed: true,
          //     choices: {
          //       text: trans('text')
          //     }
          //   }
          // }, {
          //   name: '_restrictLength',
          //   label: trans('restrict_answer_length', {}, 'quiz'),
          //   type: 'boolean',
          //   onChange: (checked) => {
          //     if (checked) {
          //       props.update('maxLength', null) // force user to fill the field
          //     } else {
          //       props.update('maxLength', 0)
          //     }
          //   },
          //   linked: [
          //     {
          //       name: 'maxLength',
          //       type: 'number',
          //       label: trans('open_maximum_length', {}, 'quiz'),
          //       required: true,
          //       displayed: (openItem) => openItem._restrictLength || 0 < openItem.maxLength
          //     }
          //   ]
          // }
        ]
      }
    ]}
  />

implementPropTypes(WaveformEditor, ItemEditorTypes, {
  item: T.shape(WaveformItemType.propTypes).isRequired
})

export {
  WaveformEditor
}
