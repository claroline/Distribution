import React from 'react'
import {connect} from 'react-redux'

import {trans} from '#/main/core/translation'
import {currentUser} from '#/main/core/user/current'
import {FormContainer} from '#/main/core/data/form/containers/form'
import {select as formSelect} from '#/main/core/data/form/selectors'
import {actions as formActions} from '#/main/core/data/form/actions'
import {Button} from '#/main/app/action/components/button'
import {UserAvatar} from '#/main/core/user/components/avatar'
import {select} from '#/plugin/forum/resources/forum/selectors'

import {constants} from '#/plugin/forum/resources/forum/constants'

const SubjectFormComponent = (props) =>
  <div>
    <h3 className="h2">{trans('new_subject', {}, 'forum')}</h3>
    <div className='user-message-container user-message-form-container user-message-left'>
      <UserAvatar picture={props.subject.meta.creator.picture} />

      <div className="user-message">
        <div className="user-message-meta">
          <div className="user-message-info">
            {props.subject.meta.creator.name}
          </div>
        </div>
        <div className="user-message-content embedded-form-section">
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
        </div>
        <Button
          className="btn btn-block btn-save"
          label={trans('post_the_subject', {}, 'forum')}
          type="callback"
          callback={() => props.saveForm(props.forumId)}
          primary={true}
        />
      </div>
    </div>
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
