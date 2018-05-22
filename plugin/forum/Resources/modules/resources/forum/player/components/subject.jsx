import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import {withRouter} from '#/main/core/router'
import {trans} from '#/main/core/translation'
import {currentUser} from '#/main/core/user/current'
import {Button} from '#/main/app/action/components/button'
import {UserMessage} from '#/main/core/user/message/components/user-message'
import {UserMessageForm} from '#/main/core/user/message/components/user-message-form'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
//  main app modals confirm
import {MODAL_CONFIRM} from '#/main/core/layout/modal'
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
      showCommentForm: null,
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

  updateMessage(messageId, content) {
    this.props.editContent(messageId, content)
    this.setState({showMessageForm: null})
  }

  createNewComment(messageId, comment) {
    this.props.createComment(messageId, comment)
    this.setState({showNewCommentForm: null})
  }

  updateComment(commentId, content) {
    this.props.editContent(commentId, content)
    this.setState({showCommentForm: null})
  }

  deleteMessage(messageId) {
    this.props.showModal(MODAL_CONFIRM, {
      dangerous: true,
      icon: 'fa fa-fw fa-trash-o',
      title: trans('delete_message', {}, 'forum'),
      question: trans('remove_post_confirm_message', {}, 'forum'),
      handleConfirm: () => this.props.deleteData(messageId)
    })
  }

  deleteComment(commentId) {
    this.props.showModal(MODAL_CONFIRM, {
      dangerous: true,
      icon: 'fa fa-fw fa-trash-o',
      title: trans('delete_comment', {}, 'forum'),
      question: trans('remove_comment_confirm_message', {}, 'forum'),
      handleConfirm: () => this.props.deleteData(commentId)
    })
  }


  render() {
    if (isEmpty(this.props.subject) && !this.props.showSubjectForm) {
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
            {(!this.props.showSubjectForm && !this.props.editingSubject) &&
              <h3 className="h2">
                {get(this.props.subject, 'meta.closed') &&
                  <span>[{trans('closed_subject', {}, 'forum')}] </span>
                }
                {get(this.props.subject, 'meta.sticky') &&
                  <span>[{trans('stuck', {}, 'forum')}] </span>
                }
                {this.props.subject.title}<small> {get(this.props.subject, 'meta.messages') || 0} réponse(s)</small>
              </h3>
            }
            {(this.props.showSubjectForm && this.props.editingSubject) &&
              <h3 className="h2">{this.props.subjectForm.title}<small> {get(this.props.subjectForm, 'meta.messages') || 0} réponse(s)</small></h3>
            }
            {(this.props.showSubjectForm && !this.props.editingSubject) &&
              <h3 className="h2">{trans('new_subject', {}, 'forum')}</h3>
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
        {this.props.showSubjectForm &&
          <SubjectForm />
        }
        {!this.props.showSubjectForm &&
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
              }, {
                icon: 'fa fa-fw fa-thumb-tack',
                label: trans('stick', {}, 'forum'),
                displayed: !(get(this.props.subject, 'meta.sticky')),
                action: () => this.props.stickSubject(this.props.subject)
              }, {
                icon: 'fa fa-fw fa-thumb-tack',
                label: trans('unstick', {}, 'forum'),
                displayed: get(this.props.subject, 'meta.sticky'),
                action: () => this.props.unStickSubject(this.props.subject)
              }, {
                icon: 'fa fa-fw fa-times-circle-o',
                label: trans('close_subject', {}, 'forum'),
                displayed: !(get(this.props.subject, 'meta.closed')),
                action: () => this.props.closeSubject(this.props.subject)
              }, {
                icon: 'fa fa-fw fa-check-circle-o',
                label: trans('open_subject', {}, 'forum'),
                displayed: (get(this.props.subject, 'meta.closed')),
                action: () => this.props.unClosedSubject(this.props.subject)
              }, {
                icon: 'fa fa-fw fa-flag',
                label: trans('flag', {}, 'forum'),
                displayed: !(get(this.props.subject, 'meta.flagged')),
                action: () => this.props.flagSubject(this.props.subject)
              },
              // {
              //   icon: 'fa fa-fw fa-flag-o',
              //   label: trans('unflag', {}, 'forum'),
              //   displayed: (get(this.props.subject, 'meta.flagged')),
              //   action: () => this.props.unFlagSubject(this.props.subject)
              // },
              {
                icon: 'fa fa-fw fa-trash-o',
                label: trans('delete'),
                displayed: true,
                action: () => console.log(this.props.subject),
                dangerous: true
              }
            ]}
          />
        }
        <hr/>
        {!isEmpty(this.props.messages)&&
          <div>
            <MessagesSort
              messages={this.props.messages}
              sortOrder={this.props.sortOrder}
            />
            <ul className="posts">
              {this.props.messages.map(message =>
                <li key={message.id} className="post">
                  {this.state.showMessageForm !== message.id &&
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
                        action: () => this.setState({showMessageForm: message.id})
                      }, {
                        icon: 'fa fa-fw fa-flag',
                        label: trans('flag', {}, 'forum'),
                        displayed: true,
                        action: () => this.props.flagMessage(message, '3dfc6ea4-8b98-412e-9b28-c08f0962253b')
                      }, {
                        icon: 'fa fa-fw fa-trash-o',
                        label: trans('delete'),
                        displayed: true,
                        action: () => this.deleteMessage(message.id),
                        dangerous: true
                      }
                    ]}
                  />
                  }
                  {this.state.showMessageForm === message.id &&
                    <UserMessageForm
                      user={currentUser()}
                      allowHtml={true}
                      submitLabel={trans('save')}
                      content={message.content}
                      submit={(content) => this.updateMessage(message.id, content)}
                      cancel={() => this.setState({showMessageForm: null})}
                    />
                  }
                  <div className="answer-comment-container">
                    {message.children.map(comment =>
                      <div key={comment.id}>
                        {this.state.showCommentForm !== comment.id &&
                          <Comment
                            user={comment.meta.creator}
                            date={comment.meta.created}
                            content={comment.content}
                            allowHtml={true}
                            actions={[
                              {
                                icon: 'fa fa-fw fa-pencil',
                                label: trans('edit'),
                                displayed: true,
                                action: () => this.setState({showCommentForm: comment.id})
                              }, {
                                icon: 'fa fa-fw fa-flag ',
                                label: trans('flag', {}, 'forum'),
                                displayed: true,
                                action: () => console.log(comment)
                              }, {
                                icon: 'fa fa-fw fa-trash-o',
                                label: trans('delete'),
                                displayed: true,
                                action: () => this.deleteComment(comment.id),
                                dangerous: true
                              }
                            ]}
                          />
                        }
                        {this.state.showCommentForm === comment.id &&
                          <CommentForm
                            user={currentUser()}
                            allowHtml={true}
                            submitLabel={trans('add_comment')}
                            content={comment.content}
                            submit={(content) => this.updateComment(comment.id, content)}
                            cancel={() => this.setState({showCommentForm: null})}
                          />
                        }
                      </div>
                    )}
                    {!this.state.showNewCommentForm &&
                      <div className="comment-link-container">
                        <Button
                          label={trans('comment', {}, 'actions')}
                          type="callback"
                          callback={() => this.setState({showNewCommentForm: message.id})}
                          className='comment-link'
                        />
                      </div>
                    }
                    {this.state.showNewCommentForm === message.id &&
                      <CommentForm
                        user={currentUser()}
                        allowHtml={true}
                        submitLabel={trans('add_comment')}
                        // content={comment.content}
                        submit={(comment) => this.createNewComment(message.id, comment)}
                        cancel={() => this.setState({showNewCommentForm: null})}
                      />
                    }
                  </div>
                </li>
              )}
            </ul>
            <hr/>
          </div>

        }
        {(!this.props.showSubjectForm || !get(this.props.subject, 'meta.closed')) &&
          <UserMessageForm
            user={currentUser()}
            allowHtml={true}
            submitLabel={trans('reply', {}, 'actions')}
            submit={(message) => this.props.createMessage(this.props.subject.id, message)}
          />
        }
      </section>
    )
  }
}

SubjectComponent.propTypes = {
  subject: T.shape(SubjectType.propTypes).isRequired,
  subjectForm: T.shape(SubjectType.propTypes).isRequired,
  createMessage: T.func.isRequired,
  editContent: T.func.isRequired,
  flagMessage: T.func.isRequired,
  // unFlagMessage: T.func.isRequired,
  flagSubject: T.func.isRequired,
  unFlagSubject: T.func.isRequired,
  deleteData: T.func.isRequired,
  createComment: T.func.isRequired,
  subjectEdition: T.func.isRequired,
  invalidated: T.bool.isRequired,
  loaded: T.bool.isRequired,
  reload: T.func.isRequired,
  showModal: T.func,
  showSubjectForm: T.bool.isRequired,
  editingSubject: T.bool.isRequired,
  messages: T.arrayOf(T.shape({})),
  sortOrder: T.number.isRequired
}

const Subject =  withRouter(connect(
  state => ({
    subject: select.subject(state),
    subjectForm: formSelect.data(formSelect.form(state, 'subjects.form')),
    editingSubject: select.editingSubject(state),
    showSubjectForm: select.showSubjectForm(state),
    messages: listSelect.data(listSelect.list(state, 'subjects.messages')),
    // sortedMessages
    invalidated: listSelect.invalidated(listSelect.list(state, 'subjects.messages')),
    loaded: listSelect.loaded(listSelect.list(state, 'subjects.messages')),
    sortOrder: listSelect.list(state, 'subjects.messages').sortOrder
  }),
  dispatch => ({
    createMessage(subjectId, content) {
      dispatch(actions.createMessage(subjectId, content))
    },
    createComment(messageId, comment) {
      dispatch(actions.createComment(messageId, comment))
    },
    showModal(type, props) {
      dispatch(modalActions.showModal(type, props))
    },
    deleteData(id) {
      dispatch(listActions.deleteData('subjects.messages', ['apiv2_forum_message_delete_bulk'], [{id: id}]))
    },
    reload(id) {
      dispatch(listActions.fetchData('subjects.messages', ['claroline_forum_api_subject_getmessages', {id}]))
    },
    subjectEdition() {
      dispatch(actions.subjectEdition())
    },
    stickSubject(subject) {
      dispatch(actions.stickSubject(subject))
    },
    unStickSubject(subject) {
      dispatch(actions.unStickSubject(subject))
    },
    closeSubject(subject) {
      dispatch(actions.closeSubject(subject))
    },
    unCloseSubject(subject) {
      dispatch(actions.unCloseSubject(subject))
    },
    editContent(id, content) {
      dispatch(actions.editContent(id, content))
    },
    flagMessage(message, subjectId) {
      dispatch(actions.flagMessage(message, subjectId))
    },
    flagSubject(subject) {
      dispatch(actions.flagSubject(subject))
    },
    unFlagSubject(subject) {
      dispatch(actions.unFlagSubject(subject))
    }
  })
)(SubjectComponent))

export {
  Subject
}
