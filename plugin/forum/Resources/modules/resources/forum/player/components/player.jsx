import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'


import {Routes} from '#/main/core/router'
import {select as formSelect} from '#/main/core/data/form/selectors'

import {actions} from '#/plugin/forum/resources/forum/player/actions'
import {Subject} from '#/plugin/forum/resources/forum/player/components/subject'
import {Subjects} from '#/plugin/forum/resources/forum/player/components/subjects'

const PlayerComponent = (props) =>
  <Routes
    routes={[
      {
        path: '/subjects',
        component: Subjects,
        exact: true
      }, {
        path: '/subjects/form/:id?',
        component: Subject,
        onEnter: (params) => {
          if (params.id === ':id') {
            props.newSubject()
          } else {
            props.newSubject(params.id)
          }
        },
        onLeave: () => props.closeSubjectForm()
      },{
        path: '/subjects/show/:id',
        component: Subject,
        onEnter: (params) => props.openSubject(params.id)
      }
    ]}
  />

Player.propTypes = {
  newSubject: T.func.isRequired,
  closeSubjectForm: T.func.isRequired,
  openSubject: T.func.isRequired
}

const Player = connect(
  state =>({
    subject: formSelect.data(formSelect.form(state, 'subjects.form'))
  }),
  dispatch => ({
    newSubject(id) {
      dispatch(actions.newSubject(id))
    },
    openSubject(id) {
      dispatch(actions.openSubject(id))
    },
    closeSubjectForm() {
      dispatch(actions.closeSubjectForm())
    }
  })
)(PlayerComponent)

export {
  Player
}
