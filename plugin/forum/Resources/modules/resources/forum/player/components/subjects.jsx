import React from 'react'
import {connect} from 'react-redux'

import {DataListContainer} from '#/main/core/data/list/containers/data-list'
import {trans} from '#/main/core/translation'

import {select} from '#/plugin/forum/resources/forum/selectors'

const SubjectsList = () =>
  <DataListContainer
    name="subjects.list"
    fetch={{
      url: ['apiv2_forum_subject_list'],
      autoload: true
    }}
    definition={[
      {
        name: 'title',
        type: 'string',
        label: trans('title'),
        displayed: true,
        primary: true
      }, {
        name: 'tags',
        type: 'enum',
        label: trans('email'),
        displayed: true
      }, {
        name: 'created',
        type: 'date',
        label: trans('creation_date')
      }, {
        name: 'creator',
        type: 'string',
        label: trans('creator'),
        displayed: true
      }
    ]}
  />

const Subjects = connect(
  state => ({
    forum: select.forum(state),
    subject: select.subject(state)
  })
)(SubjectsList)

export {
  Subjects
}
