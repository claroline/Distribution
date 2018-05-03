import React from 'react'
import {connect} from 'react-redux'

import {Routes} from '#/main/core/router'
import {Subjects} from '#/plugin/forum/resources/forum/player/components/subjects'
import {SubjectForm} from '#/plugin/forum/resources/forum/player/components/subject-form'
import {Subject} from '#/plugin/forum/resources/forum/player/components/subject'

import {actions} from '#/plugin/forum/resources/forum/player/actions'

const PlayerComponent = (props) =>
  <Routes
    routes={[
      {
        path: '/subjects',
        component: Subjects,
        exact: true
      }, {
        path: '/subjects/create',
        component: SubjectForm,
        onEnter: () => props.newSubject()

      },{
        path: '/subjects/:id',
        component: Subject,
        onEnter: params => props.fetchSubject(params.id)
      }
    ]}
  />

const Player = connect(
  null,
  dispatch => ({
    newSubject() {
      dispatch(actions.newSubject())
    },
    fetchSubject(id) {
      dispatch(actions.fetchSubject(id))
    }
  })
)(PlayerComponent)

export {
  Player
}
