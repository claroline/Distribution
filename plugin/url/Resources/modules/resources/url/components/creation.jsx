import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {FormData} from '#/main/app/content/form/containers/data'
import {actions, selectors} from '#/main/core/resource/modals/creation/store'

const UrlForm = props =>
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
            required: true,
            onChange: (url) => props.update(props.newNode, url)
          }
        ]
      }
    ]}
  />

UrlForm.propTypes = {
  newNode: T.shape({
    name: T.string
  }),
  update: T.func.isRequired
}

const UrlCreation = connect(
  (state) => ({
    newNode: selectors.newNode(state)
  }),
  (dispatch) => ({
    update(newNode, url) {

    }
  })
)(UrlCreation)

export {
  UrlCreation
}
