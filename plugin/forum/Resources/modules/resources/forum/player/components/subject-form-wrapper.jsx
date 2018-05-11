import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/core/translation'
import {UserAvatar} from '#/main/core/user/components/avatar'
import {User as UserTypes} from '#/main/core/user/prop-types'
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

SubjectFormWrapper.propTypes = {
  /**
   * The user who is creating the subject.
   *
   * @type {object}
   */
  user: T.shape(UserTypes.propTypes),

  /**
   * The action of the button
   *
   * @type {func}
   */
  callback: T.func.isRequired,

  /**
   * The content of the wrapper
   *
   * @type {node}
   */
  children: T.node.isRequired
}

export {
  SubjectFormWrapper
}
