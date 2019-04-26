import React, {Component} from 'react'
import cloneDeep from 'lodash/cloneDeep'
import classes from 'classnames'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {asset} from '#/main/app/config/asset'
import {trans} from '#/main/app/intl/translation'
import {FormData} from '#/main/app/content/form/containers/data'
import {CallbackButton} from '#/main/app/buttons/callback/components/button'
import {HtmlInput} from '#/main/app/data/types/html/components/input'

import {makeId} from '#/main/core/scaffolding/id'

import {ItemEditor as ItemEditorTypes} from '#/plugin/exo/items/prop-types'

import {
  Section as SectionType,
  WaveformItem as WaveformItemType
} from '#/plugin/audio-player/quiz/items/waveform/prop-types'
import {Waveform} from '#/plugin/audio-player/waveform/components/waveform'

class Section extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showFeedback: false
    }
  }

  render() {
    return (
      <div
        className={classes('waveform-answer answer-item', {
          'unexpected-answer' : this.props.solution.score <= 0,
          'expected-answer' : this.props.solution.score > 0
        })}
        style={{
          marginTop: '10px',
          border: this.props.selected ? 'solid 2px darkslategray' : ''
        }}
      >
        <div
          className="form-group"
          style={{display: 'flex'}}
        >
          <input
            title={trans('start', {}, 'audio')}
            type="number"
            className="form-control section-start"
            disabled={true}
            value={this.props.solution.section.start}
            style={{marginRight: '5px'}}
          />
          <input
            title={trans('end', {}, 'audio')}
            type="number"
            className="form-control section-end"
            disabled={true}
            value={this.props.solution.section.end}
            style={{marginRight: '5px'}}
          />

          <div className="right-controls">
            <input
              title={trans('score', {}, 'quiz')}
              type="number"
              className="form-control score"
              value={this.props.solution.score}
              onChange={(e) => this.props.onUpdate('score', e.target.value)}
            />

            <CallbackButton
              id={`section-${this.props.solution.section.id}-feedback-toggle`}
              className="btn-link"
              callback={() => this.setState({showFeedback: !this.state.showFeedback})}
            >
              <span className="fa fa-fw fa-comments-o" />
            </CallbackButton>

            <CallbackButton
              id={`section-${this.props.solution.section.id}-delete`}
              className="btn-link"
              callback={() => this.props.onRemove()}
              dangerous={true}
            >
              <span className="fa fa-fw fa-trash-o" />
            </CallbackButton>
          </div>
        </div>

        {this.state.showFeedback &&
          <HtmlInput
            id={`section-${this.props.solution.section.id}-feedback`}
            className="feedback-control"
            value={this.props.solution.feedback}
            onChange={(value) => this.props.onUpdate('feedback', value)}
          />
        }
      </div>
    )
  }
}

Section.propTypes = {
  solution: T.shape({
    section: T.shape(SectionType.propTypes),
    score: T.number,
    feedback: T.string
  }).isRequired,
  selected: T.bool.isRequired,
  onUpdate: T.func.isRequired,
  onRemove: T.func.isRequired
}

Section.defaultProps = {
  selected: false
}

class WaveformComponent extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentSection: null
    }
  }

  isOverlayed(start, end, index) {
    let overlayed = false

    this.props.item.solutions.forEach((s, idx) => {
      if (idx !== index && (
        (start >= s.section.start && start <= s.section.end) ||
        (end >= s.section.start && end <= s.section.end) ||
        (start <= s.section.start && end >= s.section.end)
      )) {
        overlayed = true
      }
    })

    return overlayed
  }

  render() {
    return (
      <div>
        {this.props.item.url &&
          <Waveform
            url={asset(this.props.item.url)}
            regions={this.props.item.solutions.map(s => s.section)}
            selectedRegion={this.state.currentSection}
            eventsCallbacks={{
              // 'region-created': (region) => {
              //   console.log('created')
              // },
              // 'region-updated': (region) => {
              //   console.log('updated')
              // },
              'region-update-end': (region) => {
                const newSolutions = cloneDeep(this.props.item.solutions)
                const regionIdx = newSolutions.findIndex(r => r.section.id === region.id || r.section.regionId === region.id)

                if (!this.isOverlayed(region.start, region.end, regionIdx)) {
                  if (-1 < regionIdx) {
                    newSolutions[regionIdx]['section'] = Object.assign({}, newSolutions[regionIdx]['section'], {
                      start: region.start,
                      end: region.end
                    })
                    this.setState({currentSection: newSolutions[regionIdx]['section']['id']})
                  } else {
                    newSolutions.push({
                      section: {
                        id: makeId(),
                        regionId: region.id,
                        start: region.start,
                        end: region.end,
                        startTolerance: 1,
                        endTolerance: 1
                      },
                      score: 1
                    })
                  }
                } else {
                  this.setState({currentSection: null})
                }
                this.props.update('solutions', newSolutions)
              },
              // 'region-removed': (region) => {
              //   console.log('removed')
              // },
              // 'region-play': (region) => {
              //   console.log('play')
              // },
              // 'region-in': (region) => {
              //   console.log('in')
              // },
              // 'region-out': (region) => {
              //   console.log('out')
              // },
              // 'region-mouseenter': (region) => {
              //   console.log('mouseenter')
              // },
              // 'region-mouseleave': (region) => {
              //   console.log('mouseleave')
              // },
              'region-click': (region, e) => {
                e.stopPropagation()
                e.preventDefault()
                const newSolutions = cloneDeep(this.props.item.solutions)
                const current = newSolutions.find(s => s.section.id === region.id || s.section.regionId === region.id)

                if (current) {
                  if (current.section.id === this.state.currentSection) {
                    this.setState({currentSection: null})
                  } else {
                    this.setState({currentSection: current.section.id})
                  }
                }
                this.props.update('solutions', newSolutions)
              }
            }}
          />
        }
        {this.props.item.solutions.map(s =>
          <Section
            key={s.section.id}
            solution={s}
            selected={s.section.id === this.state.currentSection}
            onUpdate={(property, value) => {
              const newSolutions = cloneDeep(this.props.item.solutions)
              const solution = newSolutions.find(ns => ns.section.id === s.section.id)

              if (solution) {
                solution[property] = value
                this.props.update('solutions', newSolutions)
              }
            }}
            onRemove={() => {
              const newSolutions = cloneDeep(this.props.item.solutions)
              const idx = newSolutions.findIndex(ns => ns.section.id === s.section.id)

              if (-1 < idx) {
                this.setState({currentSection: null})
                newSolutions.splice(idx, 1)
                this.props.update('solutions', newSolutions)
              }
            }}
          />
        )}
      </div>
    )
  }
}

WaveformComponent.propTypes = {
  item: T.shape(WaveformItemType.propTypes).isRequired,
  update: T.func.isRequired
}

const WaveformEditor = (props) =>
  <FormData
    className="waveform-editor"
    embedded={true}
    name={props.formName}
    dataPart={props.path}
    sections={[
      {
        title: trans('general'),
        primary: true,
        fields: [
          {
            name: '_file',
            label: trans('pick_audio_file', {}, 'quiz'),
            type: 'file',
            required: true,
            calculated: () => null,
            onChange: (file) => {
              props.update('url', file.url)
              props.update('solutions', [])
            },
            options: {
              types: ['audio/*']
            }
          }, {
            name: 'data',
            label: trans('waveform'),
            hideLabel: true,
            required: true,
            render: (waveformItem) => {
              const Waveform = (
                <WaveformComponent
                  item={waveformItem}
                  update={props.update}
                />
              )

              return Waveform
            }
          }
        ]
      }
    ]}
  />

implementPropTypes(WaveformEditor, ItemEditorTypes, {
  item: T.shape(WaveformItemType.propTypes).isRequired
})

export {
  WaveformEditor
}
