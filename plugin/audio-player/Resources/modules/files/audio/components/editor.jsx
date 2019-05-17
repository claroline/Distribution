import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import cloneDeep from 'lodash/cloneDeep'

import {asset} from '#/main/app/config/asset'
import {trans} from '#/main/app/intl/translation'
import {actions as formActions, selectors as formSelectors} from '#/main/app/content/form/store'
import {FormData} from '#/main/app/content/form/containers/data'
import {HtmlInput} from '#/main/app/data/types/html/components/input'

import {makeId} from '#/main/core/scaffolding/id'
import {selectors} from '#/main/core/resources/file/store'
import {selectors as editorSelect} from '#/main/core/resources/file/editor/store/selectors'
import {selectors as resourceSelect} from '#/main/core/resource/store'
import {Checkbox} from '#/main/core/layout/form/components/field/checkbox'

import {constants} from '#/plugin/audio-player/files/audio/constants'
import {Audio as AudioType, Section as SectionType} from '#/plugin/audio-player/files/audio/prop-types'
import {Waveform} from '#/plugin/audio-player/waveform/components/waveform'

const SectionConfiguration = (props) =>
  <div>
    <Checkbox
      key={`section-${props.section.id}-comments`}
      id={`section-${props.section.id}-comments`}
      label={trans('allow_comments', {}, 'audio')}
      checked={props.section.commentsAllowed}
      onChange={checked => props.onUpdate('commentsAllowed', checked)}
    />
    <Checkbox
      key={`section-${props.section.id}-show-transcript`}
      id={`section-${props.section.id}-show-transcript`}
      label={trans('transcript', {}, 'audio')}
      checked={props.section.showTranscript}
      onChange={checked => props.onUpdate('showTranscript', checked)}
    />
    {props.section.showTranscript &&
      <HtmlInput
        id={`section-${props.section.id}-transcript`}
        value={props.section.transcript}
        onChange={value => props.onUpdate('transcript', value)}
      />
    }
    <Checkbox
      key={`section-${props.section.id}-show-help`}
      id={`section-${props.section.id}-show-help`}
      label={trans('show_help', {}, 'audio')}
      checked={props.section.showHelp}
      onChange={checked => props.onUpdate('showHelp', checked)}
    />
    {props.section.showHelp &&
      <HtmlInput
        id={`section-${props.section.id}-help`}
        value={props.section.help}
        onChange={value => props.onUpdate('help', value)}
      />
    }
  </div>

SectionConfiguration.propTypes = {
  section: T.shape(SectionType.propTypes).isRequired,
  onUpdate: T.func.isRequired,
  onRemove: T.func.isRequired
}

class AudioConfiguration extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentSection: null
    }
  }

  render() {
    return (
      <div>
        <Waveform
          id={`resource-audio-${this.props.file.id}`}
          url={asset(this.props.file.hashName)}
          rateControl={this.props.file.rateControl}
          regions={constants.MANAGER_TYPE === this.props.file.sectionsType && this.props.file.sections ? this.props.file.sections : []}
          selectedRegion={this.state.currentSection}
          eventsCallbacks={constants.MANAGER_TYPE === this.props.file.sectionsType ?
            {
              'region-update-end': (region) => {
                const newSections = this.props.file.sections ? cloneDeep(this.props.file.sections) : []
                let regionId = region.id
                let start = parseFloat(region.start.toFixed(1))
                let end = parseFloat(region.end.toFixed(1))

                const regionIdx = newSections.findIndex(section => section.id === regionId || section.regionId === regionId)

                if (-1 < regionIdx) {
                  newSections[regionIdx] = Object.assign({}, newSections[regionIdx], {
                    start: start,
                    end: end
                  })
                  this.setState({currentSection: newSections[regionIdx]['id']})
                } else {
                  newSections.push(Object.assign({}, SectionType.defaultProps, {
                    id: makeId(),
                    regionId: region.id,
                    start: start,
                    end: end,
                    type: constants.MANAGER_TYPE,
                    meta: {
                      resourceNode: {id: this.props.resourceNodeId}
                    }
                  }))
                }
                this.props.update('sections', newSections)
              },
              'region-click': (region) => {
                const current = this.props.file.sections ?
                  this.props.file.sections.find(section => section.id === region.id || section.regionId === region.id) :
                  null

                if (current) {
                  if (current.id === this.state.currentSection) {
                    this.setState({currentSection: null})
                  } else {
                    this.setState({currentSection: current.id})
                  }
                }
              }
            } :
            {}
          }
        />
        {this.state.currentSection &&
          <SectionConfiguration
            section={this.props.file.sections.find(section => section.id === this.state.currentSection)}
            onUpdate={(prop, value) => {
              const newSections = cloneDeep(this.props.file.sections)
              const idx = newSections.findIndex(section => section.id === this.state.currentSection)

              if (-1 < idx) {
                newSections[idx][prop] = value
                this.props.update('sections', newSections)
              }
            }}
            onRemove={() => {
              const newSections = cloneDeep(this.props.file.sections)
              const idx = newSections.findIndex(section => section.id === this.state.currentSection)

              if (-1 < idx) {
                newSections.splice(idx, 1)
                this.props.update('sections', newSections)
              }
            }}
          />
        }
      </div>
    )
  }
}

AudioConfiguration.propTypes = {
  file: T.shape(AudioType.propTypes).isRequired,
  resourceNodeId: T.string.isRequired,
  update: T.func.isRequired
}

const Audio = props =>
  <FormData
    className="audio-editor"
    embedded={true}
    name={editorSelect.FORM_NAME}
    sections={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: 'sectionsType',
            type: 'choice',
            label: trans('sections_type', {}, 'audio'),
            required: true,
            options: {
              noEmpty: true,
              multiple: false,
              condensed: true,
              choices: constants.SECTIONS_TYPES
            },
            onChange: () => props.update('sections', [])
          }, {
            name: 'rateControl',
            label: trans('activate_rate_control', {}, 'audio'),
            type: 'boolean'
          }, {
            name: 'audioConfig',
            label: trans('audio'),
            hideLabel: true,
            required: true,
            render: () => {
              const AudioConfig = (
                <AudioConfiguration
                  file={props.fileForm}
                  resourceNodeId={props.resourceNodeId}
                  update={props.update}
                />
              )

              return AudioConfig
            }
          }
        ]
      }
    ]}
  />

Audio.propTypes = {
  mimeType: T.string.isRequired,
  file: T.shape(AudioType.propTypes).isRequired,
  fileForm: T.shape(AudioType.propTypes).isRequired,
  resourceNodeId: T.string.isRequired,
  update: T.func.isRequired
}

const AudioEditor = connect(
  (state) => ({
    mimeType: selectors.mimeType(state),
    fileForm: formSelectors.data(formSelectors.form(state, editorSelect.FORM_NAME)),
    resourceNodeId: resourceSelect.resourceNode(state).id
  }),
  (dispatch) => ({
    update(prop, value) {
      dispatch(formActions.updateProp(editorSelect.FORM_NAME, prop, value))
    }
  })
)(Audio)

export {
  AudioEditor
}
