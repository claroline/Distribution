import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {Routes} from '#/main/app/router'
import {actions as listActions} from '#/main/core/data/list/actions'

import {actions} from '#/plugin/forum/resources/forum/player/actions'
import {select} from '#/plugin/forum/resources/forum/selectors'
import {Subject} from '#/plugin/forum/resources/forum/player/components/subject'
import {Subjects} from '#/plugin/forum/resources/forum/player/components/subjects'

const PlayerComponent = (props) =>
  <Routes
    routes={[
      {
        path: '/subjects',
        component: Subjects,
        exact: true,
        onEnter: () => props.loadSubjectList()
      }, {
        path: '/subjects/form/:id?',
        component: Subject,
        onEnter: (params) => {
          if (params.id) {
            props.newSubject(params.id)
          } else {
            props.newSubject()
          }
        },
        onLeave: () => {
          props.closeSubjectForm()
          if(props.editingSubject){
            props.stopSubjectEdition()
          }
        }
      },{
        path: '/subjects/show/:id',
        component: Subject,
        onEnter: (params) => props.openSubject(params.id),
        onLeave: () => {
          if(props.showSubjectForm){
            props.closeSubjectForm()
          }
        }
      }
    ]}
  />

PlayerComponent.propTypes = {
  newSubject: T.func.isRequired,
  closeSubjectForm: T.func.isRequired,
  stopSubjectEdition: T.func.isRequired,
  openSubject: T.func.isRequired,
  showSubjectForm: T.bool.isRequired,
  editingSubject: T.bool.isRequired,
  loadSubjectList: T.func.isRequired
}

const Player = connect(
  state => ({
    editingSubject: select.editingSubject(state),
    showSubjectForm: select.showSubjectForm(state)
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
    },
    stopSubjectEdition() {
      dispatch(actions.stopSubjectEdition())
    },
    loadSubjectList() {
      dispatch(listActions.invalidateData('subjects.list'))
    }
  })
)(PlayerComponent)

export {
  Player
}
