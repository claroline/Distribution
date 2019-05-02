import React from 'react'
import {PropTypes as T} from 'prop-types'
import cloneDeep from 'lodash/cloneDeep'

import {asset} from '#/main/app/config/asset'
import {trans} from '#/main/app/intl/translation'
import {CallbackButton} from '#/main/app/buttons/callback/components/button'

import {makeId} from '#/main/core/scaffolding/id'

import {isOverlayed} from '#/plugin/audio-player/quiz/items/waveform/utils'
import {Section as SectionType} from '#/plugin/audio-player/quiz/items/waveform/prop-types'
import {Waveform} from '#/plugin/audio-player/waveform/components/waveform'

const Section = props =>
  <div style={{marginTop: '10px'}}>
    <div
      className="form-group"
      style={{display: 'flex'}}
    >
      <input
        title={trans('start', {}, 'audio')}
        type="number"
        className="form-control section-start"
        disabled={true}
        value={props.section.start}
        style={{marginRight: '5px'}}
      />
      <input
        title={trans('end', {}, 'audio')}
        type="number"
        className="form-control section-end"
        disabled={true}
        value={props.section.end}
        style={{marginRight: '5px'}}
      />

      {!props.readOnly &&
        <div className="right-controls">
          <CallbackButton
            id={`section-${props.section.id}-delete`}
            className="btn-link"
            callback={() => props.onRemove()}
            dangerous={true}
          >
            <span className="fa fa-fw fa-trash-o" />
          </CallbackButton>
        </div>
      }
    </div>
  </div>

Section.propTypes = {
  section: T.shape(SectionType.propTypes).isRequired,
  readOnly: T.bool.isRequired,
  onRemove: T.func.isRequired
}

Section.defaultProps = {
  readOnly: false
}

const WaveformPlayer = (props) =>
  <div>
    <Waveform
      id={`waveform-player-${props.item.id}`}
      url={asset(props.item.url)}
      editable={!props.disabled}
      maxRegions={props.item.answersLimit}
      regions={props.answer.map(a => a.id ? a : Object.assign({}, a, {id: makeId()}))}
      eventsCallbacks={{
        'region-update-end': (region) => {
          if (!props.disabled) {
            const newAnswer = cloneDeep(props.answer)
            const answerIdx = newAnswer.findIndex(a => a.id === region.id)

            if (!isOverlayed(props.answer, region.start, region.end, answerIdx)) {
              if (-1 < answerIdx) {
                newAnswer[answerIdx]['start'] = parseFloat(region.start.toFixed(1))
                newAnswer[answerIdx]['end'] = parseFloat(region.end.toFixed(1))
              } else if (!props.answersLimit || newAnswer.length < props.answersLimit) {
                newAnswer.push({
                  id: region.id,
                  start: parseFloat(region.start.toFixed(1)),
                  end: parseFloat(region.end.toFixed(1))
                })
              }
            }
            props.onChange(newAnswer)
          }
        },
        'region-click': (region, e) => {
          e.stopPropagation()
          e.preventDefault()
        }
      }}
    />
    {props.answer.map(a =>
      <Section
        key={`section-${a.start}`}
        section={a}
        readOnly={props.disabled}
        onRemove={() => {
          const newAnswer = cloneDeep(props.answer)
          const answerIdx = newAnswer.findIndex(na => na.id === a.id)

          if (-1 < answerIdx) {
            newAnswer.splice(answerIdx, 1)
            props.onChange(newAnswer)
          }
        }}
      />
    )}
  </div>

WaveformPlayer.propTypes = {
  item: T.shape({
    url: T.string.isRequired,
    answersLimit: T.number.isRequired
  }).isRequired,
  answer: T.arrayOf(T.shape({
    id: T.string,
    start: T.number.isRequired,
    end: T.number.isRequired
  })),
  disabled: T.bool.isRequired,
  onChange: T.func.isRequired
}

WaveformPlayer.defaultProps = {
  answer: [],
  disabled: false
}

export {
  WaveformPlayer
}
