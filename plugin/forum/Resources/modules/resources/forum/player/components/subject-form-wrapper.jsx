import React from 'react'

import {trans} from '#/main/core/translation'
import {UserAvatar} from '#/main/core/user/components/avatar'
import {Button} from '#/main/app/action/components/button'

const SubjectFormWrapper = (props) =>
  <div>
    <div className='user-message-container user-message-form-container user-message-left'>
      <UserAvatar picture={props.user.picture} />

      <div className="user-message">
        <div className="user-message-meta">
          <div className="user-message-info">
            {props.user.name}
          </div>
        </div>
        <div className="user-message-content embedded-form-section">
          {props.children}
        </div>
        <Button
          className="btn btn-block btn-save"
          label={trans('post_the_subject', {}, 'forum')}
          type="callback"
          callback={props.callback}
          primary={true}
        />
      </div>
    </div>
  </div>


export {
  SubjectFormWrapper
}
