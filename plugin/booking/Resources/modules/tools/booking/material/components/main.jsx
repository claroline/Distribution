import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {LINK_BUTTON} from '#/main/app/buttons'
import {Routes} from '#/main/app/router'
import {ToolPage} from '#/main/core/tool/containers/page'

import {MaterialList} from '#/plugin/booking/tools/booking/material/components/list'
import {MaterialForm} from '#/plugin/booking/tools/booking/material/containers/form'
import {MaterialDetails} from '#/plugin/booking/tools/booking/material/containers/details'

const MaterialMain = (props) =>
  <ToolPage
    subtitle={trans('materials', {}, 'booking')}
    primaryAction="add"
    actions={[
      {
        name: 'add',
        type: LINK_BUTTON,
        icon: 'fa fa-fw fa-plus',
        label: trans('add_material', {}, 'booking'),
        target: props.path+'/materials/new',
        primary: true,
        displayed: props.editable
      }
    ]}
  >
    <Routes
      path={props.path+'/materials'}
      routes={[
        {
          path: '/',
          exact: true,
          render: () => {
            return (
              <MaterialList
                path={props.path}
              />
            )
          }
        }, {
          path: '/new',
          onEnter: () => props.open(),
          component: MaterialForm,
          disabled: !props.editable
        }, {
          path: '/:id',
          exact: true,
          onEnter: (params = {}) => props.open(params.id),
          component: MaterialDetails
        }, {
          path: '/:id/edit',
          onEnter: (params = {}) => props.open(params.id),
          component: MaterialForm,
          disabled: !props.editable
        }
      ]}
    />
  </ToolPage>

MaterialMain.propTypes = {
  path: T.string.isRequired,
  open: T.func.isRequired,
  editable: T.bool.isRequired
}

export {
  MaterialMain
}
