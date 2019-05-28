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

import {makeId} from '#/main/core/scaffolding/id'
import {selectors as fileSelect} from '#/main/core/resources/file/store'
import {selectors as resourceSelect} from '#/main/core/resource/store'
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
      showComment: constants.USER_TYPE === props.section.type,
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
          {constants.USER_TYPE === this.props.section.type && authenticatedUser &&
            <CallbackButton
              className="btn section-btn"
              callback={() => this.props.deleteSection()}
              dangerous={true}
            >
              <span className="fa fa-trash-o"/>
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
  deleteSection: T.func.isRequired,
  saveComment: T.func.isRequired,
  deleteComment: T.func.isRequired
}

const Sections = props =>
  <div className="audio-player-sections">
    {props.sections.map(section =>
      <Section
        key={`section-${section.id}`}
        section={section}
        deleteSection={() => props.deleteSection(section.id)}
        saveComment={(comment) => props.saveComment(section.id, comment)}
        deleteComment={(commentId) => props.deleteComment(section.id, commentId)}
      />
    )}
  </div>

Sections.propTypes = {
  sections: T.arrayOf(T.shape(SectionType.propTypes)),
  deleteSection: T.func.isRequired,
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
          regions={-1 < [constants.MANAGER_TYPE, constants.USER_TYPE].indexOf(this.props.file.sectionsType) && this.props.file.sections ?
            this.props.file.sections :
            []
          }
          eventsCallbacks={{
            'seek-time': (time) => {
              if (this.props.file.sections) {
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
            },
            'region-update-end': (region) => {
              if (constants.USER_TYPE === this.props.file.sectionsType && authenticatedUser) {
                const regionId = region.id
                const start = parseFloat(region.start.toFixed(1))
                const end = parseFloat(region.end.toFixed(1))

                const section = this.props.file.sections.find(s => s.id === regionId || s.regionId === regionId)
                let newSection = null
                let isNew = false

                if (section) {
                  newSection = Object.assign({}, section, {
                    start: start,
                    end: end
                  })
                } else {
                  newSection = Object.assign({}, SectionType.defaultProps, {
                    id: makeId(),
                    regionId: region.id,
                    start: start,
                    end: end,
                    type: constants.USER_TYPE,
                    commentsAllowed: true,
                    meta: {
                      resourceNode: {id: this.props.resourceNodeId},
                      user: authenticatedUser
                    }
                  })
                  isNew = true
                }
                this.props.saveSection(this.props.file.sections, newSection, isNew)
              }
            },
            'region-click': (region) => {
              if (constants.USER_TYPE === this.props.file.sectionsType) {
                // const current = this.props.file.sections ?
                //   this.props.file.sections.find(section => section.id === region.id || section.regionId === region.id) :
                //   null
                //
                // if (current) {
                //   if (current.id === this.state.currentSection) {
                //     this.setState({currentSection: null})
                //   } else {
                //     this.setState({currentSection: current.id})
                //   }
                // }
              }
            }
          }}
        />
        {0 < this.state.ongoingSections.length &&
          <Sections
            sections={this.props.file.sections.filter(s => -1 < this.state.ongoingSections.indexOf(s.id))}
            deleteSection={(sectionId) => this.props.deleteSection(this.props.file.sections, sectionId)}
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
  resourceNodeId: T.string.isRequired,
  saveSection: T.func.isRequired,
  deleteSection: T.func.isRequired,
  saveComment: T.func.isRequired,
  deleteComment: T.func.isRequired
}

const AudioPlayer = connect(
  (state) => ({
    mimeType: fileSelect.mimeType(state),
    resourceNodeId: resourceSelect.resourceNode(state).id
  }),
  (dispatch) => ({
    saveSection(sections, section, isNew) {
      dispatch(actions.saveSection(sections, section, isNew))
    },
    deleteSection(sections, sectionId) {
      dispatch(modalActions.showModal(MODAL_CONFIRM, {
        icon: 'fa fa-fw fa-trash-o',
        title: trans('section_deletion', {}, 'audio'),
        question: trans('section_deletion_confirm_message', {}, 'audio'),
        dangerous: true,
        handleConfirm: () => dispatch(actions.deleteSection(sections, sectionId))
      }))
    },
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
