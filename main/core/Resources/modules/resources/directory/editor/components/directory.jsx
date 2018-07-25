import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {LINK_BUTTON} from '#/main/app/buttons'

import {FormContainer} from '#/main/core/data/form/containers/form'

const DirectoryEditor = (props) =>
  <FormContainer
    name="directoryForm"
    target={['apiv2_resource_directory_update', {id: props.directory.id}]}
    buttons={true}
    cancel={{
      type: LINK_BUTTON,
      target: '/',
      exact: true
    }}
    sections={[
      {
        title: trans('general'),
        primary: true,
        fields: [

        ]
      }
    ]}
  />

DirectoryEditor.propTypes = {
  directory: T.shape({
    id: T.string.isRequired
  })
}

export {
  DirectoryEditor
}
