import {connect} from 'react-redux'
import React, {Component} from 'react'
import cloneDeep from 'lodash/cloneDeep'
import {PropTypes as T} from 'prop-types'
import {trans} from '#/main/core/translation'
import {makeId} from '#/main/core/scaffolding/id'
import Modal from 'react-bootstrap/lib/Modal'

import {MODAL_DELETE_CONFIRM} from '#/main/core/layout/modal'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {constants as formConst} from '#/main/core/layout/form/constants'
import {BaseModal} from '#/main/core/layout/modal/components/base.jsx'
import {TooltipAction} from '#/main/core/layout/button/components/tooltip-action.jsx'
import {CheckGroup} from '#/main/core/layout/form/components/group/check-group.jsx'
import {FileGroup} from '#/main/core/layout/form/components/group/file-group.jsx'
import {SelectGroup} from '#/main/core/layout/form/components/group/select-group.jsx'

import {Track as TrackTypes} from '#/plugin/video-player/resources/video/prop-types'
import {actions} from '#/plugin/video-player/resources/video/editor/actions'

export const MODAL_VIDEO_SUBTITLES = 'MODAL_VIDEO_SUBTITLES'

function generateLangs() {
  const langs = {}
  Object.keys(formConst.LANGS).forEach(key => langs[key] = formConst.LANGS[key]['nativeName'])

  return langs
}

const SubtitleForm = props =>
  <form>
    <SelectGroup
      id="lang-select"
      label={trans('lang')}
      choices={generateLangs()}
      value={props.track.meta.lang}
      error={null}
      multiple={false}
      onChange={value => props.updateProperty('lang', value)}
    />
    <CheckGroup
      id="default-checkbox"
      label={trans('is_default')}
      value={props.track.meta.default}
      onChange={value => props.updateProperty('default', value)}
    />
    <FileGroup
      id="subtitle-file-input"
      label={trans('subtitle_file')}
      value={null}
      multiple={false}
      error={null}
      onChange={(file) => props.updateProperty('file', value)}
    />
    <button
      className="btn btn-primary"
      type="button"
      onClick={() => props.save(props.track)}
    >
      {trans('save')}
    </button>
    <button
      className="btn btn-default"
      type="button"
      onClick={() => props.cancel()}
    >
      {trans('cancel')}
    </button>
  </form>

SubtitleForm.propTypes = {
  track: T.shape(TrackTypes.propTypes),
  updateProperty: T.func.isRequired,
  save: T.func.isRequired,
  cancel: T.func.isRequired
}

class Subtitles extends Component {
  constructor(props) {
    super(props)

    this.state = {
      track: {},
      showForm: false,
      currentTrack: null
      // theme: cloneDeep(props.theme),
      // pendingChanges: false,
      // validating: false,
      // errors: {}
    }
    this.updateProperty = this.updateProperty.bind(this)
    this.saveTrackForm = this.saveTrackForm.bind(this)
  }

  updateProperty(property, value) {
    const track = cloneDeep(this.state.track)

    switch (property) {
      case 'lang':
        track['meta']['lang'] = value
        track['meta']['label'] = formConst.LANGS[value]['nativeName']
        break
      case 'default':
        track['meta']['default'] = value
        break
      case 'file':
        console.log(value)
        break
    }
    this.setState({track: track})
  }

  showTrackForm(id) {
    const data = {
      showForm: true,
      currentTrack: id
    }

    if (id === 'new') {
      data['track'] = {
        id: makeId(),
        video: {
          id: this.props.videoId
        },
        meta: {
          label: '',
          lang: '',
          kind: 'subtitles',
          default: false
        }
      }
    } else {
      data['track'] = this.props.tracks.find(t => t.id === id)
    }
    this.setState(data)
  }

  saveTrackForm(track) {
    this.props.saveSubtitle(track)
    this.setState({
      track: {},
      showForm: false,
      currentTrack: null
    })
  }

  cancelTrackForm(id) {
    this.setState({
      track: {},
      showForm: false,
      currentTrack: null
    })
  }

  render() {
    return (
      <BaseModal
        title={trans('subtitles')}
        icon="fa fa-fw fa-list"
        {...this.props}
      >
        <Modal.Body>
          <div className="alert alert-info">
            {trans('subtitle_format_message')}
          </div>

          {this.props.tracks.length > 0 ?
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>{trans('lang')}</th>
                    <th className="text-center">{trans('is_default')}</th>
                    <th className="text-center">{trans('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.tracks.map(t => this.state.showForm && this.state.currentTrack === t.id ?
                    <tr key={`track-row-${t.id}`}>
                      <td colSpan="3">
                        <SubtitleForm
                          track={this.state.track}
                          updateProperty={(prop, value) => this.updateProperty(prop, value)}
                          save={this.saveTrackForm}
                          cancel={() => this.cancelTrackForm()}
                        />
                      </td>
                    </tr> :
                    <tr key={`track-row-${t.id}`}>
                      <td>{t.meta.label}</td>
                      <td className="boolean-cell">
                        {t.meta.default ?
                          <span className="fa fa-fw fa-check true"/> :
                          <span className="fa fa-fw fa-times false"/>
                        }
                      </td>
                      <td className="text-center">
                        <TooltipAction
                          id="subtitle-edit"
                          className="btn-link-default"
                          icon="fa fa-fw fa-pencil"
                          label={trans('edit_subtitle')}
                          action={() => this.showTrackForm(t.id)}
                        />
                        <TooltipAction
                          id="subtitle-remove"
                          className="btn-link-danger"
                          icon="fa fa-fw fa-trash-o"
                          label={trans('delete_subtitle')}
                          action={() => this.props.deleteSubtitle(t.id)}
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div> :
            <div className="alert alert-warning">
              {trans('no_subtitle')}
            </div>
          }
          {this.state.showForm && this.state.currentTrack === 'new' ?
            <SubtitleForm
              track={this.state.track}
              updateProperty={(prop, value) => this.updateProperty(prop, value)}
              save={this.saveTrackForm}
              cancel={() => this.cancelTrackForm()}
            /> :
            <button
              className="btn btn-primary"
              onClick={() => this.showTrackForm('new')}
            >
              {trans('add_subtitle')}
            </button>
          }
        </Modal.Body>

        <button className="modal-btn btn btn-default" onClick={this.props.hideModal}>
          {trans('close')}
        </button>
      </BaseModal>
    )
  }
}

Subtitles.propTypes = {
  videoId: T.number.isRequired,
  tracks: T.arrayOf(T.shape(TrackTypes.propTypes)),
  saveSubtitle: T.func.isRequired,
  deleteSubtitle: T.func.isRequired,
  hideModal: T.func.isRequired
}

const SubtitlesModal = connect(
  state => ({
    videoId: state.video.id,
    tracks: state.tracks
  }),
  (dispatch) => ({
    saveSubtitle: (track) => dispatch(actions.saveSubtitle(track)),
    deleteSubtitle: id => dispatch(modalActions.showModal(MODAL_DELETE_CONFIRM, {
      title: trans('delete_subtitle'),
      question: trans('delete_subtitle_confirm_message'),
      handleConfirm: () => dispatch(actions.deleteSubtitle(id))
    })),
    hideModal: () => dispatch(modalActions.hideModal())
  })
)(Subtitles)

export {
  SubtitlesModal
}