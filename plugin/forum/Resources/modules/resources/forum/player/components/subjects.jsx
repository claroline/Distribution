import React from 'react'
import {connect} from 'react-redux'

import {DataListContainer} from '#/main/core/data/list/containers/data-list'
import {trans} from '#/main/core/translation'

import {select} from '#/plugin/forum/resources/forum/selectors'

const SubjectsList = (props) =>
  <DataListContainer
    name="subjects.list"
    fetch={{
      url: ['claroline_forum_api_forum_getsubjects', {id: props.forum.id}],
      autoload: true
    }}
    primaryAction={(subject) => ({
      type: 'link',
      target: '/subjects/'+subject.id,
      label: trans('open', {}, 'actions')
    })}
    definition={[
      {
        name: 'title',
        type: 'string',
        label: trans('title'),
        displayed: true,
        primary: true
      }, {
        name: 'tags',
        type: 'string',
        label: trans('email'),
        displayed: true
      }, {
        name: 'meta.created',
        type: 'date',
        label: trans('creation_date'),
        displayed: true,
        option: {
          time: true
        }
      }
      // {
      //   name: 'creator',
      //   type: 'string',
      //   label: trans('creator'),
      //   displayed: true
      // }
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
