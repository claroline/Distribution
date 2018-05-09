import React from 'react'
import {connect} from 'react-redux'

import {Routes} from '#/main/core/router'
import {Subjects} from '#/plugin/forum/resources/forum/player/components/subjects'
import {SubjectForm} from '#/plugin/forum/resources/forum/player/components/subject-form'
import {Subject} from '#/plugin/forum/resources/forum/player/components/subject'
import {actions as listActions} from '#/main/core/data/list/actions'

import {actions} from '#/plugin/forum/resources/forum/player/actions'

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
        onEnter: () => props.newSubject()
        // ajouter un fetchsubject

      },{
        path: '/subjects/show/:id',
        component: Subject,
        onEnter: (params) => props.openSubject(params.id)
      }
    ]}
  />

const Player = connect(
  null,
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
