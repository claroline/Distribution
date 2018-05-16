import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'
import trim from 'lodash/trim'

import {withRouter} from '#/main/core/router'
import {trans} from '#/main/core/translation'
import {currentUser} from '#/main/core/user/current'
import {Button} from '#/main/app/action/components/button'
import {UserMessage} from '#/main/core/user/message/components/user-message'
import {UserMessageForm} from '#/main/core/user/message/components/user-message-form'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'
import {actions as listActions} from '#/main/core/data/list/actions'
import {select as listSelect} from '#/main/core/data/list/selectors'
import {select as formSelect} from '#/main/core/data/form/selectors'

import {Subject as SubjectType} from '#/plugin/forum/resources/forum/player/prop-types'
import {select} from '#/plugin/forum/resources/forum/selectors'
import {actions} from '#/plugin/forum/resources/forum/player/actions'
import {CommentForm, Comment} from '#/plugin/forum/resources/forum/player/components/comments'
import {SubjectForm} from '#/plugin/forum/resources/forum/player/components/subject-form'
import {MessagesSort} from '#/plugin/forum/resources/forum/player/components/messages-sort'

class SubjectComponent extends Component {
  constructor(props) {
    super(props)

    if (this.props.invalidated || !this.props.loaded) {
      this.props.reload(this.props.subject.id)
    }

    this.state = {
      showMessageForm: false,
      showNewCommentForm: null
    }
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.invalidated !== this.props.invalidated && this.props.invalidated)
    || (prevProps.loaded !== this.props.loaded && !this.props.loaded)) {
      this.props.reload(this.props.subject.id)
    }
  }

  editSubject(subjectId) {
    this.props.subjectEdition()
    this.props.history.push(`/subjects/form/${subjectId}`)
  }

  createNewMessage(message) {
    const content = trim(message)
    this.props.createMessage(this.props.subject.id, content)
  }

  showMessageForm(message) {
    // this.setState({showNewCommentForm: messageId})
    console.log(message)
  }

  showCommentForm(messageId) {
    this.setState({showNewCommentForm: messageId})
  }

  createNewComment(messageId, comment) {
    this.props.createComment(messageId, comment)
    this.setState({showNewCommentForm: null})
  }

  deleteMessage(messageId) {
    this.props.showModal(MODAL_DELETE_CONFIRM, {
      title: trans('delete_message', {}, 'forum'),
      question: trans('remove_post_confirm_message', {}, 'forum'),
      handleConfirm: () => this.props.deleteData(messageId)
    })
  }


  render() {
    if (isEmpty(this.props.subject) && !this.props.subjectForm.showSubjectForm) {
      return(
        <span>Loading</span>
      )
    }
    return (
      <section>
        <header className="subject-info">
          <div>
            <Button
              label={trans('forum_back_to_subjects', {}, 'forum')}
              type="link"
              target="/subjects"
              className="btn-link"
              primary={true}
            />
          </div>
          <div>
            {!this.props.subjectForm.showSubjectForm &&
              <h3 className="h2">{this.props.subject.title}<small> {get(this.props.subject, 'meta.messages') || 0} réponse(s)</small></h3>
            }
            {(this.props.subjectForm.showSubjectForm && !this.props.subjectForm.editingSubject) &&
              <h3 className="h2">{trans('new_subject', {}, 'forum')}</h3>
            }
            {this.props.subjectForm.editingSubject &&
              <h3 className="h2">{trans('subject_edition', {}, 'forum')}</h3>
            }
            {!isEmpty(this.props.subject.tags)&&
              <div className="tag">
                {this.props.subject.tags.map(tag =>
                  <span key={tag} className="label label-primary"><span className="fa fa-fw fa-tag" />{tag}</span>
                )}
              </div>
            }
          </div>
        </header>
        {this.props.subjectForm.showSubjectForm &&
          <SubjectForm />
        }
        {!this.props.subjectForm.showSubjectForm &&
          <UserMessage
            user={get(this.props.subject, 'meta.creator')}
            date={get(this.props.subject, 'meta.created') || ''}
            content={get(this.props.subject, 'content') || ''}
            allowHtml={true}
            actions={[
              {
                icon: 'fa fa-fw fa-pencil',
                label: trans('edit'),
                displayed: true,
                action: () => this.editSubject(this.props.subject.id)
              }
            ]}
          />
        }
        {!isEmpty(this.props.messages)&&
          <div>
            <MessagesSort
              messages={this.props.messages}
              sortOrder={this.props.sortOrder}
            />
            <ul className="posts">
              {this.props.messages.map(message =>
                <li key={message.id} className="post">
                  <UserMessage
                    user={message.meta.creator}
                    date={message.meta.created}
                    content={message.content}
                    allowHtml={true}
                    actions={[
                      {
                        icon: 'fa fa-fw fa-pencil',
                        label: trans('edit'),
                        displayed: true,
                        action: () => this.showMessageForm(message)
                      }, {
                        icon: 'fa fa-fw fa-trash-o',
                        label: trans('delete'),
                        displayed: true,
                        action: () => this.deleteMessage(message.id),
                        dangerous: true
                      }
                    ]}
                  />
                  <div className="answer-comment-container">
                    {message.children.map(comment =>
                      <Comment
                        key={comment.id}
                        user={comment.meta.creator}
                        date={comment.meta.created}
                        content={comment.content}
                        allowHtml={true}
                        actions={[
                          {
                            icon: 'fa fa-fw fa-pencil',
                            label: trans('edit'),
                            displayed: true,
                            action: () => this.showMessageForm(message)
                          }, {
                            icon: 'fa fa-fw fa-trash-o',
                            label: trans('delete'),
                            displayed: true,
                            action: () => this.deleteMessage(message.id),
                            dangerous: true
                          }
                        ]}
                      />
                    )}
                    {!this.state.showNewCommentForm &&
                      <div className="comment-link-container">
                        <Button
                          label={trans('comment', {}, 'actions')}
                          type="callback"
                          callback={() => this.showCommentForm(message.id)}
                          className='comment-link'
                        />
                      </div>
                    }
                    {this.state.showNewCommentForm === message.id &&
                      <CommentForm
                        user={currentUser()}
                        allowHtml={true}
                        submitLabel={trans('add_comment')}
                        submit={(comment) => this.createNewComment(message.id, comment)}
                        cancel={() => this.setState({showNewCommentForm: null})}
                      />
                    }
                  </div>
                </li>
              )}
            </ul>
          </div>
        }
        {!this.props.subjectForm.showSubjectForm &&
          <UserMessageForm
            user={currentUser()}
            allowHtml={true}
            submitLabel={trans('send')}
            submit={(message) => this.createNewMessage(message)}
            // cancel={() => this.setState({showNewMessageForm: false})}
          />
        }
      </section>
    )
  }
}

SubjectComponent.propTypes = {
  subject: T.shape(SubjectType.propTypes).isRequired,
  createMessage: T.func.isRequired,
  deleteData: T.func.isRequired,
  createComment: T.func.isRequired,
  invalidated: T.bool.isRequired,
  loaded: T.bool.isRequired,
  reload: T.func.isRequired,
  showModal: T.func,
  subjectForm: T.shape({
    showSubjectForm: T.bool.isRequired,
    editingSubject: T.bool.isRequired
  }),
  messages: T.arrayOf(T.shape({})),
  sortOrder: T.number.isRequired
}

const Subject =  withRouter(connect(
  state => ({
    subject: select.subject(state),
    subjectForm: formSelect.form(state, 'subjects.form'),
    messages: listSelect.data(listSelect.list(state, 'subjects.messages')),
    // sortedMessages
    invalidated: listSelect.invalidated(listSelect.list(state, 'subjects.messages')),
    loaded: listSelect.loaded(listSelect.list(state, 'subjects.messages')),
    sortOrder: listSelect.list(state, 'subjects.messages').sortOrder
  }),
  dispatch => ({
    createMessage(subjectId, content) {
      // à la réussite cabler avec invalidateData (comme pour delete)
      dispatch(actions.createMessage(subjectId, content))
    },
    createComment(messageId, comment) {
      dispatch(actions.createComment(messageId, comment))
    },
    showModal(type, props) {
      dispatch(modalActions.showModal(type, props))
    },
    deleteData(id) {
      dispatch(listActions.deleteData('subjects.messages', 'apiv2_forum_api_message_delete_bulk', [{id: id}]))
    },
    reload(id) {
      dispatch(listActions.fetchData('subjects.messages', ['claroline_forum_api_subject_getmessages', {id}]))
    },
    subjectEdition() {
      dispatch(actions.subjectEdition())
    }
  })
)(SubjectComponent))

export {
  Subject
}
