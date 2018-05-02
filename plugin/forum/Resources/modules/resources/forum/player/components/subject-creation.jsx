import React from 'react'

import {currentUser} from '#/main/core/user/current'
import {FormContainer} from '#/main/core/data/form/containers/form'
import {trans} from '#/main/core/translation'

import {UserAvatar} from '#/main/core/user/components/avatar'

const user = currentUser()
const SubjectCreationComponent = () =>
  <div>
    <h3>{trans('new_subject', {}, 'forum')}</h3>
    <div className='user-message-container user-message-form-container user-message-left'>
      <UserAvatar picture={user.picture} />

      <div className="user-message">
        <div className="user-message-meta">
          <div className="user-message-info">
            {user.name}
          </div>
        </div>
        <FormContainer
          level={3}
          displayLevel={2}
          name="subjectForm"
          // title={trans('new_subject', {}, 'forum')}
          className="content-container"
          sections={[
            {
              title: trans('general'),
              primary: true,
              fields: [
                {
                  name: 'display.title',
                  type: 'text',
                  label: trans('forum_subject_title_form_title', {}, 'forum'),
                  required: true
                },
                {
                  name: 'display.post',
                  type: 'html',
                  label: trans('post', {}, 'forum'),
                  required: true
                },
                {
                  name: 'display.tags',
                  type: 'text',
                  label: trans('tags')
                }
              ]
            }, {
              icon: 'fa fa-fw fa-desktop',
              title: trans('display_parameters'),
              fields: [
                {
                  name: 'display.sticked',
                  type: 'boolean',
                  label: trans('stick', {}, 'forum'),
                  help: trans('stick_explanation', {}, 'forum')
                },
                {
                  name: 'display.poster',
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
        <button
          className="btn btn-block btn-primary btn-save"
          // onClick={() => }
        >
          {trans('create_the_subject', {}, 'forum')}
        </button>
      </div>
    </div>
  </div>
export {
  SubjectCreationComponent
}
