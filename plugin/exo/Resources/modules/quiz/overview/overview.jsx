import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {trans, tex} from '#/main/core/translation'
import {select as resourceSelect} from '#/main/core/resource/selectors'
import {ResourceOverview} from '#/main/core/resource/components/overview.jsx'

import {select} from '#/plugin/exo/quiz/selectors'

const OverviewComponent = props =>
  <ResourceOverview
    contentText={props.quiz.description ||
      <span className="empty-text">{trans('no_description')}</span>
    }
    actions={[
      {
        type: 'link',
        icon: 'fa fa-fw fa-play icon-with-text-right',
        label: tex('exercise_start'),
        target: '/play',
        primary: true,
        disabled: false
      }
    ]}
  />

OverviewComponent.propTypes = {
  empty: T.bool.isRequired,
  editable: T.bool.isRequired,
  quiz: T.shape({
    description: T.string,
    meta: T.object.isRequired,
    parameters: T.object.isRequired,
    picking: T.object.isRequired
  }).isRequired
}

const Overview = connect(
  (state) => ({
    empty: select.empty(state),
    editable: resourceSelect.editable(state),
    quiz: select.quiz(state)
  })
)(OverviewComponent)

export {
  Overview
}
