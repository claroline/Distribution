import React from 'react'
import {PropTypes as T} from 'prop-types'

import {t} from '#/main/core/translation'

import {DataFormModal} from '#/main/core/data/form/components/modal/form.jsx'

const MODAL_CONFIGURE_FIELD = 'MODAL_CONFIGURE_FIELD'

const ConfigureFieldModal = props =>
  <DataFormModal
    {...props}
    title={t('edit_field')}
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

ConfigureFieldModal.propTypes = {
  data: T.shape({
    type: T.string.isRequired
    //
  }),
  fadeModal: T.func.isRequired,
  save: T.func.isRequired
}

export {
  MODAL_CONFIGURE_FIELD,
  ConfigureFieldModal
}
