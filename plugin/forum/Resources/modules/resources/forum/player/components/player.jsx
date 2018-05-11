import React from 'react'
import {connect} from 'react-redux'


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
        // doit avoir info dans le store pour savoir que le subject est en mode édition
        // si il y a un id en param de la fction = en mode édition, sonon on est dans de la création
        onEnter: (params) => {
          if (params.id === ':id') {
            props.newSubject()
          } else {
            props.newSubject(params.id)
          }
        }
        // ajouter un fetchsubject

      },{
        path: '/subjects/show/:id',
        component: Subject,
        onEnter: (params) => props.openSubject(params.id)
      }
    ]}
  />

const Player = connect(
  state =>({
    subject: formSelect.data(formSelect.form(state, 'subjects.form'))
  }),
  dispatch => ({
    newSubject() {
      dispatch(actions.newSubject())
    },
    openSubject(id) {
      dispatch(actions.openSubject(id))
    }
  })
)(PlayerComponent)

export {
  Player
}
