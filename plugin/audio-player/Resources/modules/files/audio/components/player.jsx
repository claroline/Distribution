import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import cloneDeep from 'lodash/cloneDeep'
import classes from 'classnames'

import {currentUser} from '#/main/app/security'
import {asset} from '#/main/app/config/asset'
import {trans} from '#/main/app/intl/translation'
import {actions as modalActions} from '#/main/app/overlay/modal/store'
import {MODAL_CONFIRM} from '#/main/app/modals/confirm'
import {CALLBACK_BUTTON} from '#/main/app/buttons'
import {CallbackButton} from '#/main/app/buttons/callback/components/button'
import {HtmlInput} from '#/main/app/data/types/html/components/input'

import {selectors} from '#/main/core/resources/file/store'
import {HtmlText} from '#/main/core/layout/components/html-text'
import {UserMessageForm} from '#/main/core/user/message/components/user-message-form'
import {UserMessage} from '#/main/core/user/message/components/user-message'

import {constants} from '#/plugin/audio-player/files/audio/constants'
import {actions} from '#/plugin/audio-player/files/audio/store'
import {Audio as AudioType, Section as SectionType} from '#/plugin/audio-player/files/audio/prop-types'
import {Waveform} from '#/plugin/audio-player/waveform/components/waveform'

const authenticatedUser = currentUser()

const Transcripts = props =>
  <div className="audio-player-transcripts">
    {props.transcripts.map((transcript, idx) =>
      <HtmlText key={`transcript-${idx}`}>
        {transcript}
      </HtmlText>
    )}
  </div>

Transcripts.propTypes = {
  transcripts: T.arrayOf(T.string)
}

class Section extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showHelp: false,
      showComment: false,
      showCommentForm: false,
      showAudioUrl: false
    }
  }

  render() {
    return (
      <div className="audio-player-section">
        <div className="section-controls">
          {this.props.section.showHelp &&
            <CallbackButton
              className={classes('btn section-btn', {'activated': this.state.showHelp})}
              callback={() => this.setState({showHelp: !this.state.showHelp})}
            >
              <span className="fa fa-file-text-o"/>
            </CallbackButton>
          }
          {this.props.section.commentsAllowed &&
            <CallbackButton
              className={classes('btn section-btn', {'activated': this.state.showComment})}
              callback={() => this.setState({showComment: !this.state.showComment})}
            >
              <span className="fa fa-comment-alt"/>
            </CallbackButton>
          }
          {this.props.section.showAudio && this.props.section.audioUrl &&
            <CallbackButton
              className={classes('btn section-btn', {'activated': this.state.showAudioUrl})}
              callback={() => this.setState({showAudioUrl: !this.state.showAudioUrl})}
            >
              <span className="fa fa-volume-up"/>
            </CallbackButton>
          }
        </div>
        <div className="section-display">
          {this.state.showHelp &&
            <HtmlText className="section-help">
              {this.props.section.help}
            </HtmlText>
          }
          {this.state.showComment && (!this.props.section.comment || this.state.showCommentForm ?
            <UserMessageForm
              user={authenticatedUser}
              content={this.props.section.comment ? this.props.section.comment.content : ''}
              allowHtml={true}
              submitLabel={trans('add_comment')}
              submit={(content) => {
                const comment = {
                  content: content,
                  meta: {
                    user: authenticatedUser,
                    section: this.props.section
                  }
                }

                if (this.props.section.comment) {
                  comment['id'] = this.props.section.comment.id
                }
                this.props.saveComment(comment)
                this.setState({showCommentForm: false})
              }}
              cancel={() => this.setState({showCommentForm: false})}
            /> :
            <UserMessage
              user={this.props.section.comment && this.props.section.comment.meta && this.props.section.comment.meta.user ?
                this.props.section.comment.meta.user :
                undefined
              }
              date={this.props.section.comment && this.props.section.comment.meta ? this.props.section.comment.meta.creationDate : ''}
              content={this.props.section.comment ? this.props.section.comment.content : ''}
              allowHtml={true}
              actions={[
                {
                  icon: 'fa fa-fw fa-pencil',
                  type: CALLBACK_BUTTON,
                  label: trans('edit'),
                  displayed: true,
                  callback: () => this.setState({showCommentForm: true})
                }, {
                  icon: 'fa fa-fw fa-trash-o',
                  type: CALLBACK_BUTTON,
                  label: trans('delete'),
                  displayed: true,
                  callback: () => this.props.section.comment && this.props.section.comment.id ?
                    this.props.deleteComment(this.props.section.comment.id) :
                    false,
                  dangerous: true
                }
              ]}
            />
          )}
          {this.state.showAudioUrl && this.props.section.audioUrl &&
            <div>
              <audio
                controls
              >
                <source
                  src={asset(this.props.section.audioUrl)}
                />
              </audio>
            </div>
          }
        </div>
      </div>
    )
  }
}

Section.propTypes = {
  section: T.shape(SectionType.propTypes),
  saveComment: T.func.isRequired,
  deleteComment: T.func.isRequired
}

const Sections = props =>
  <div className="audio-player-sections">
    {props.sections.map(section =>
      <Section
        key={`section-${section.id}`}
        section={section}
        saveComment={(comment) => props.saveComment(section.id, comment)}
        deleteComment={(commentId) => props.deleteComment(section.id, commentId)}
      />
    )}
  </div>

Sections.propTypes = {
  sections: T.arrayOf(T.shape(SectionType.propTypes)),
  saveComment: T.func.isRequired,
  deleteComment: T.func.isRequired
}

class Audio extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ongoingSections: []
    }
  }

  render() {
    return (
      <div className="audio-resource-player">
        {0 < this.state.ongoingSections.length &&
        0 < this.props.file.sections.filter(s => -1 < this.state.ongoingSections.indexOf(s.id) && s.showTranscript && s.transcript).length &&
          <Transcripts
            transcripts={this.props.file.sections
              .filter(s => -1 < this.state.ongoingSections.indexOf(s.id) && s.showTranscript && s.transcript)
              .map(s => s.transcript)
            }
          />
        }
        <Waveform
          id={`resource-audio-${this.props.file.id}`}
          url={asset(this.props.file.hashName)}
          editable={constants.USER_TYPE === this.props.file.sectionsType}
          rateControl={this.props.file.rateControl}
          regions={constants.MANAGER_TYPE === this.props.file.sectionsType && this.props.file.sections ? this.props.file.sections : []}
          eventsCallbacks={{
            'seek-time': (time) => {
              if (constants.MANAGER_TYPE === this.props.file.sectionsType && this.props.file.sections) {
                const newOngoingSections = this.props.file.sections.filter(s => s.start <= time && s.end >= time).map(s => s.id)
                this.setState({ongoingSections: newOngoingSections})
              }
            },
            'region-in': (region) => {
              const newOngoingSections = cloneDeep(this.state.ongoingSections)

              if (-1 === newOngoingSections.indexOf(region.id)) {
                newOngoingSections.push(region.id)
                this.setState({ongoingSections: newOngoingSections})
              }
            },
            'region-out': (region) => {
              const newOngoingSections = cloneDeep(this.state.ongoingSections)
              const idx = newOngoingSections.indexOf(region.id)

              if (-1 < idx) {
                newOngoingSections.splice(idx, 1)
                this.setState({ongoingSections: newOngoingSections})
              }
            }
          }}
        />
        {0 < this.state.ongoingSections.length &&
          <Sections
            sections={this.props.file.sections.filter(s => -1 < this.state.ongoingSections.indexOf(s.id))}
            saveComment={(sectionId, comment) => this.props.saveComment(this.props.file.sections, sectionId, comment)}
            deleteComment={(sectionId, commentId) => this.props.deleteComment(this.props.file.sections, sectionId, commentId)}
          />
        }
      </div>
    )
  }
}

Audio.propTypes = {
  mimeType: T.string.isRequired,
  file: T.shape(AudioType.propTypes).isRequired,
  saveComment: T.func.isRequired,
  deleteComment: T.func.isRequired
}

const AudioPlayer = connect(
  (state) => ({
    mimeType: selectors.mimeType(state)
  }),
  (dispatch) => ({
    saveComment(sections, sectionId, comment) {
      dispatch(actions.saveSectionComment(sections, sectionId, comment))
    },
    deleteComment(sections, sectionId, commentId) {
      dispatch(modalActions.showModal(MODAL_CONFIRM, {
        icon: 'fa fa-fw fa-trash-o',
        title: trans('comment_deletion'),
        question: trans('comment_deletion_confirm_message'),
        dangerous: true,
        handleConfirm: () => dispatch(actions.deleteSectionComment(sections, sectionId, commentId))
      }))
    }
  })
)(Audio)

export {
  AudioPlayer
}
