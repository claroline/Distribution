import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'

import {selectors} from '#/plugin/path/resources/path/dashboard/store'
import {Path as PathType} from '#/plugin/path/resources/path/prop-types'

const DashboardMain = (props) =>
  <ListData
    name={selectors.STORE_NAME+'.evaluations'}
    fetch={{
      url: ['innova_path_progressions_fetch', {id: props.path.id}],
      autoload: true
    }}
    primaryAction={(row) => ({
      type: CALLBACK_BUTTON,
      callback: () => {
        props.fetchUserStepsProgression(props.path.id, row.user.id)
        props.showStepsProgressionModal(row, props.path.steps)
      }
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
        calculated: (rowData) => `${rowData.score}/${rowData.scoreMax}`
      }, {
        name: 'progression',
        label: trans('percentage'),
        type: 'number',
        displayed: true,
        calculated: (rowData) => `${rowData.progression ? rowData.progression : 0}%`
      }
    ]}
  />

DashboardMain.propTypes = {
  path: T.shape(PathType.propTypes).isRequired,
  fetchUserStepsProgression: T.func.isRequired,
  showStepsProgressionModal: T.func.isRequired
}

export {
  DashboardMain
}
