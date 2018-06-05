import React, {Component} from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

import {withRouter} from '#/main/app/router'
import {trans, transChoice} from '#/main/core/translation'
import {currentUser} from '#/main/core/user/current'
import {Button} from '#/main/app/action/components/button'
import {UserMessage} from '#/main/core/user/message/components/user-message'
import {UserMessageForm} from '#/main/core/user/message/components/user-message-form'
import {withModal} from '#/main/app/overlay/modal/withModal'
import {MODAL_CONFIRM} from '#/main/app/modals/confirm'
import {actions as listActions} from '#/main/core/data/list/actions'
import {select as listSelect} from '#/main/core/data/list/selectors'
import {select as formSelect} from '#/main/core/data/form/selectors'

import {Subject as SubjectType} from '#/plugin/forum/resources/forum/player/prop-types'
import {select} from '#/plugin/forum/resources/forum/selectors'
import {actions} from '#/plugin/forum/resources/forum/player/actions'
import {MessageComments} from '#/plugin/forum/resources/forum/player/components/message-comments'
import {SubjectForm} from '#/plugin/forum/resources/forum/player/components/subject-form'
import {MessagesSort} from '#/plugin/forum/resources/forum/player/components/messages-sort'

const authenticatedUser = currentUser()

class SubjectComponent extends Component {
  constructor(props) {
    super(props)

    if (this.props.invalidated || !this.props.loaded) {
      this.props.reload(this.props.subject.id)
    }
    this.state = {
      showMessageForm: null
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

  updateMessage(message, content) {
    this.props.editContent(message, this.props.subject.id, content)
    this.setState({showMessageForm: null})
  }


  deleteSubject(subjectId) {
    this.props.showModal(MODAL_CONFIRM, {
      dangerous: true,
      icon: 'fa fa-fw fa-trash-o',
      title: trans('delete_subject', {}, 'forum'),
      question: trans('remove_subject_confirm_message', {}, 'forum'),
      handleConfirm: () => this.props.deleteSubject([subjectId], this.props.history.push)
    })
  }

  deleteMessage(messageId) {
    this.props.showModal(MODAL_CONFIRM, {
      dangerous: true,
      icon: 'fa fa-fw fa-trash-o',
      title: trans('delete_message', {}, 'forum'),
      question: trans('remove_post_confirm_message', {}, 'forum'),
      handleConfirm: () => this.props.deleteMessage(messageId)
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
          {/* {this.props.subject.poster &&
            <img className="subject-poster img-responsive" alt={this.props.subject.title} src={asset(this.props.subject.poster.url)} />
          } */}
          <div>
            {(!this.props.showSubjectForm && !this.props.editingSubject) &&
              <h3 className="h2">
                {get(this.props.subject, 'meta.closed') &&
                  <span>[{trans('closed_subject', {}, 'forum')}] </span>
                }
                {get(this.props.subject, 'meta.sticky') &&
                  <span>[{trans('stuck', {}, 'forum')}] </span>
                }
                {this.props.subject.title}<small> {transChoice('replies', this.props.totalResults, {count: this.props.totalResults}, 'forum')}</small>
              </h3>
            }
            {(this.props.showSubjectForm && this.props.editingSubject) &&
              <h3 className="h2">{this.props.subjectForm.title}<small> {transChoice('replies', this.props.totalResults, {count: this.props.totalResults}, 'forum')}</small></h3>
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
                displayed: !(get(this.props.subject, 'meta.sticky', true)),
                action: () => this.props.stickSubject(this.props.subject)
              }, {
                icon: 'fa fa-fw fa-thumb-tack',
                label: trans('unstick', {}, 'forum'),
                displayed: get(this.props.subject, 'meta.sticky', false),
                action: () => this.props.unStickSubject(this.props.subject)
              }, {
                icon: 'fa fa-fw fa-times-circle-o',
                label: trans('close_subject', {}, 'forum'),
                displayed: !(get(this.props.subject, 'meta.closed', true)),
                action: () => this.props.closeSubject(this.props.subject)
              }, {
                icon: 'fa fa-fw fa-check-circle-o',
                label: trans('open_subject', {}, 'forum'),
                displayed: (get(this.props.subject, 'meta.closed', false)),
                action: () => this.props.unCloseSubject(this.props.subject)
              }, {
                icon: 'fa fa-fw fa-flag-o',
                label: trans('flag', {}, 'forum'),
                displayed: (get(this.props.subject, 'meta.creator') !== authenticatedUser) && !(get(this.props.subject, 'meta.flagged')),
                action: () => this.props.flagSubject(this.props.subject)
              }, {
                icon: 'fa fa-fw fa-flag',
                label: trans('unflag', {}, 'forum'),
                displayed: ((get(this.props.subject, 'meta.creator') !== authenticatedUser) && (get(this.props.subject, 'meta.flagged'))),
                action: () => this.props.unFlagSubject(this.props.subject)
              }, {
                icon: 'fa fa-fw fa-trash-o',
                label: trans('delete'),
                displayed: true,
                action: () => this.deleteSubject(this.props.subject.id),
                dangerous: true
              }
            ]}
          />
        }
        {!isEmpty(this.props.messages)&&
          <div>
            <MessagesSort
              sortOrder={this.props.sortOrder}
              messages={this.props.messages}
              totalResults={this.props.totalResults}
              pages={this.props.pages}
              toggleSort={() => this.props.toggleSort(this.props.sortOrder)}
              changePage={() => this.props.changePage(this.props.currentPage + 1)}
              changePagePrev={() => this.props.changePage(this.props.currentPage - 1)}
            >
              <ul className="posts">
                {this.props.messages.map(message =>
                  <li key={message.id} className="post">
                    {this.state.showMessageForm !== message.id &&
                      <UserMessage
                        user={get(message, 'meta.creator')}
                        date={message.meta.created}
                        content={message.content}
                        allowHtml={true}
                        actions={[
                          {
                            icon: 'fa fa-fw fa-pencil',
                            label: trans('edit'),
                            displayed: message.meta.creator.id === authenticatedUser.id,
                            action: () => this.setState({showMessageForm: message.id})
                          }, {
                            icon: 'fa fa-fw fa-flag-o',
                            label: trans('flag', {}, 'forum'),
                            displayed: (message.meta.creator.id !== authenticatedUser.id) && !message.meta.flagged,
                            action: () => this.props.flag(message, this.props.subject.id)
                          }, {
                            icon: 'fa fa-fw fa-flag',
                            label: trans('unflag', {}, 'forum'),
                            displayed: (message.meta.creator.id !== authenticatedUser.id) && message.meta.flagged,
                            action: () => this.props.unFlag(message, this.props.subject.id)
                          }, {
                            icon: 'fa fa-fw fa-trash-o',
                            label: trans('delete'),
                            displayed:  message.meta.creator.id === authenticatedUser.id,
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
                          submit={(content) => this.updateMessage(message, content)}
                          cancel={() => this.setState({showMessageForm: null})}
                        />
                    }
                    <MessageComments
                      message={message}
                    />
                  </li>
                )}
              </ul>
            </MessagesSort>
          </div>
        }
        {this.props.showSubjectForm || !get(this.props.subject, 'meta.closed') &&
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
  subjectForm: T.shape({
    title: T.string
  }),
  createMessage: T.func.isRequired,
  editContent: T.func.isRequired,
  flag: T.func.isRequired,
  stickSubject: T.func.isRequired,
  unStickSubject: T.func.isRequired,
  closeSubject: T.func.isRequired,
  unCloseSubject: T.func.isRequired,
  unFlag: T.func.isRequired,
  flagSubject: T.func.isRequired,
  unFlagSubject: T.func.isRequired,
  deleteMessage: T.func.isRequired,
  deleteSubject: T.func.isRequired,
  subjectEdition: T.func.isRequired,
  invalidated: T.bool.isRequired,
  loaded: T.bool.isRequired,
  reload: T.func.isRequired,
  showModal: T.func,
  showSubjectForm: T.bool.isRequired,
  editingSubject: T.bool.isRequired,
  messages: T.arrayOf(T.shape({})),
  totalResults: T.number.isRequired,
  sortOrder: T.number.isRequired,
  pages: T.number,
  currentPage: T.number,
  changePage: T.func,
  changePagePrev: T.func,
  toggleSort: T.func.isRequired,
  history: T.object.isRequired
}

const Subject =  withRouter(withModal(connect(
  state => ({
    subject: select.subject(state),
    subjectForm: formSelect.data(formSelect.form(state, 'subjects.form')),
    editingSubject: select.editingSubject(state),
    sortOrder: listSelect.sortBy(listSelect.list(state, 'subjects.messages')).direction,
    showSubjectForm: select.showSubjectForm(state),
    messages: listSelect.data(listSelect.list(state, 'subjects.messages')),
    totalResults: listSelect.totalResults(listSelect.list(state, 'subjects.messages')),
    invalidated: listSelect.invalidated(listSelect.list(state, 'subjects.messages')),
    loaded: listSelect.loaded(listSelect.list(state, 'subjects.messages')),
    pages: listSelect.pages(listSelect.list(state, 'subjects.messages')),
    currentPage: listSelect.currentPage(listSelect.list(state, 'subjects.messages'))
  }),
  dispatch => ({
    createMessage(subjectId, content) {
      dispatch(actions.createMessage(subjectId, content))
    },
    deleteSubject(id, push) {
      dispatch(actions.deleteSubject(id, push))
    },
    deleteMessage(id) {
      dispatch(listActions.deleteData('subjects.messages', ['apiv2_forum_message_delete_bulk'], [{id: id}]))
    },
    reload(id) {
      dispatch(listActions.fetchData('subjects.messages', ['claroline_forum_api_subject_getmessages', {id}]))
    },
    toggleSort(sortOrder) {
      dispatch(listActions.updateSortDirection('subjects.messages', -sortOrder))
      dispatch(listActions.invalidateData('subjects.messages'))
    },
    changePage(page) {
      dispatch(listActions.changePage('subjects.messages', page))
      dispatch(listActions.invalidateData('subjects.messages'))
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
    flagSubject(subject) {
      dispatch(actions.flagSubject(subject))
    },
    unFlagSubject(subject) {
      dispatch(actions.unFlagSubject(subject))
    },
    editContent(message, subjectId, content) {
      dispatch(actions.editContent(message, subjectId, content))
    },
    flag(message, subjectId) {
      dispatch(actions.flag(message, subjectId))
    },
    unFlag(message, subjectId) {
      dispatch(actions.unFlag(message, subjectId))
    }
  })
)(SubjectComponent)))

export {
  Subject
}
