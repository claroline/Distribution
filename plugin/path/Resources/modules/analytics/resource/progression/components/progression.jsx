import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {MODAL_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'

import {selectors} from '#/plugin/analytics/resource/dashboard/store'
import {Path as PathType} from '#/plugin/path/resources/path/prop-types'
import {MODAL_USER_PROGRESSION} from '#/plugin/path/resources/path/modals/user-progression'

const Progression = (props) =>
  <ListData
    name={selectors.STORE_NAME+'.evaluations'}
    fetch={{
      url: ['innova_path_progressions_fetch', {id: props.path.id}],
      autoload: true
    }}
    primaryAction={(row) => ({
      type: MODAL_BUTTON,
      modal: [MODAL_USER_PROGRESSION, {
        evaluation: row,
        path: props.path
      }]
    })}
    definition={[
      {
        name: 'userName',
        label: trans('user'),
        type: 'string',
        displayed: true
      }, {
        name: 'score',
        label: trans('progression'),
        type: 'number',
        displayed: true,
        filterable: false,
        sortable: false,
        calculated: (rowData) => `${rowData.progression}/${rowData.progressionMax}`
      }, {
        name: 'progression',
        label: trans('percentage'),
        type: 'number',
        displayed: true,
        filterable: false,
        calculated: (rowData) => `${rowData.progression && rowData.progressionMax ? Math.round((rowData.progression / rowData.progressionMax) * 100) : 0}%`
      }
    ]}
  />

Progression.propTypes = {
  path: T.shape(PathType.propTypes).isRequired
}

export {
  Progression
}
