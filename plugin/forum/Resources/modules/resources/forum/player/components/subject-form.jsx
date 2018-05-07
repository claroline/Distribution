import React from 'react'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {FormContainer} from '#/main/core/data/form/containers/form'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import {select} from '#/plugin/forum/resources/forum/selectors'

import {constants} from '#/plugin/forum/resources/forum/constants'
import {SubjectFormWrapper} from '#/plugin/forum/resources/forum/player/components/subject-form-wrapper'

const SubjectFormComponent = (props) =>
  <div>
    <h3 className="h2">{trans('new_subject', {}, 'forum')}</h3>
    <SubjectFormWrapper
      user={props.subject.meta.creator}
      callback={() => props.saveForm(props.forumId)}
    >
      <FormContainer
        level={3}
        displayLevel={2}
        name="subjects.form"
        // title={trans('new_subject', {}, 'forum')}
        className="content-container"
        sections={[
          {
            title: trans('general'),
            primary: true,
            fields: [
              {
                name: 'title',
                type: 'text',
                label: trans('forum_subject_title_form_title', {}, 'forum'),
                required: true
              },
              {
                name: 'message',
                type: 'html',
                label: trans('post', {}, 'forum'),
                required: true
              },
              {
                name: 'tags',
                type: 'text',
                label: trans('tags')
              }
            ]
          }, {
            icon: 'fa fa-fw fa-desktop',
            title: trans('display_parameters'),
            fields: [
              {
                name: 'sorted',
                type: 'enum',
                label: trans('messages_sort_display', {}, 'forum'),
                options: {
                  noEmpty: true,
                  choices: constants.MESSAGE_SORT_DISPLAY
                }
              }, {
                name: 'sticked',
                type: 'boolean',
                label: trans('stick', {}, 'forum'),
                help: trans('stick_explanation', {}, 'forum')
              }, {
                name: 'poster',
                label: trans('poster'),
                type: 'image',
                options: {
                  ratio: '3:1'
                }
              }
            ]
          }
        ]}
      />
    </SubjectFormWrapper>
  </div>

const SubjectForm = connect(
  state => ({
    forumId: select.forumId(state),
    subject: formSelect.data(formSelect.form(state, 'subjects.form'))
  }),
  dispatch => ({
    saveForm(forumId){
      dispatch(formActions.saveForm('subjects.form', ['claroline_forum_api_forum_createsubject', {id: forumId}]))
    }
  })
)(SubjectFormComponent)

export {
  SubjectForm
}
