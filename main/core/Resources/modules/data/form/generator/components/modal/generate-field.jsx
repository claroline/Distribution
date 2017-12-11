import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'

import {t} from '#/main/core/translation'

import {DataFormModal} from '#/main/core/data/form/components/modal/form.jsx'

const MODAL_GENERATE_FIELD = 'MODAL_GENERATE_FIELD'

const GenerateFieldModal = props =>
  <DataFormModal
    {...props}
    title="Editer le champ"
    sections={[
      {
        id: 'general',
        title: t('general'),
        primary: true,
        fields: [
          {
            name: 'name',
            type: 'string',
            label: t('name'),
            required: true
          }, {
            name: 'required',
            type: 'boolean',
            label: t('field_optional'),
            options: {
              labelChecked: t('field_required')
            }
          }
        ]
      }, {
        id: 'parameters',
        icon: 'fa fa-fw fa-cog',
        title: t('parameters'),
        fields: [

        ]
      }, {
        id: 'help',
        icon: 'fa fa-fw fa-info',
        title: t('help'),
        fields: [
          {
            name: 'help',
            type: 'string',
            label: t('message'),
            options: {
              long: true
            }
          }
        ]
      }, {
        id: 'restrictions',
        icon: 'fa fa-fw fa-key',
        title: t('access_restrictions'),
        fields: [

        ]
      }
    ]}
  />

GenerateFieldModal.propTypes = {
  data: T.shape({
    type: T.string.isRequired
    //
  }),
  fadeModal: T.func.isRequired,
  save: T.func.isRequired
}

export {
  MODAL_GENERATE_FIELD,
  GenerateFieldModal
}
