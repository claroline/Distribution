import React, {Fragment} from 'react'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {ContentLoader} from '#/main/app/content/components/loader'
import {ContentTitle} from '#/main/app/content/components/title'
import {DetailsData} from '#/main/app/content/details/containers/data'

import {Material as MaterialTypes} from '#/plugin/booking/prop-types'
import {selectors} from '#/plugin/booking/tools/booking/material/store/selectors'

const MaterialDetails = (props) => {
  if (isEmpty(props.material)) {
    return (
      <ContentLoader
        className="row"
        size="lg"
        description={trans('material_loading', {}, 'booking')}
      />
    )
  }
  return (
    <Fragment>
      <ContentTitle
        backAction={{
          type: LINK_BUTTON,
          label: trans('back'),
          target: props.path+'/materials',
          exact: true
        }}
        title={props.material.name}
        actions={[
          {
            name: 'edit',
            type: LINK_BUTTON,
            icon: 'fa fa-fw fa-pencil',
            label: trans('edit', {}, 'actions'),
            target: props.path+'/materials/'+props.material.id+'/edit',
            group: trans('management'),
            scope: ['object']
          }
        ]}
      />

      <DetailsData
        name={selectors.FORM_NAME}
        sections={[
          {
            title: trans('general'),
            primary: true,
            fields: [
              {
                name: 'description',
                type: 'html',
                label: trans('description'),
                required: true
              }, {
                name: 'code',
                type: 'string',
                label: trans('code'),
                required: true
              }, {
                name: 'quantity',
                type: 'number',
                label: trans('quantity'),
                required: true,
                options: {
                  min: 0
                }
              }
            ]
          }
        ]}
      />
    </Fragment>
  )
}

MaterialDetails.propTypes = {
  path: T.string.isRequired,
  material: T.shape(
    MaterialTypes.propTypes
  )
}

export {
  MaterialDetails
}
