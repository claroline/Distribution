import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/app/intl/translation'
import {FormData} from '#/main/app/content/form/containers/data'
import {selectors} from '#/main/core/resource/modals/creation/store'

const UrlForm = () =>
  <FormData
    level={5}
    name={selectors.STORE_NAME}
    dataPart={selectors.FORM_RESOURCE_PART}
    sections={[
      {
        title: trans('url'),
        primary: true,
        fields: [
          {
            name: 'url',
            label: trans('url'),
            type: 'url',
            required: true
          },
          {
            name: 'mode',
            label: trans('mode'),
            type: 'choice',
            required: true,
            options: {
              choices: {
                'iframe': 'iframe',
                'redirect': 'redirect',
                'tab': 'tab'
              }
            }
          }
        ]
      }
    ]}
  />

UrlForm.propTypes = {
  newNode: T.shape({
    name: T.string
  })
}

const UrlCreation = connect(
  (state) => ({
    newNode: selectors.newNode(state)
  })
)(UrlForm)

export {
  UrlCreation
}
