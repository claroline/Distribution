import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'

import {PaperTabs} from '#/plugin/exo/items/components/paper-tabs'

const WaveformPaper = props =>
  <PaperTabs
    id={props.item.id}
    showYours={props.showYours}
    yours={
      <div className="waveform-paper">
        Waveform paper
      </div>
    }
    expected={
      <div>
        Expected
      </div>
    }
    stats={
      <div>
        Stats
      </div>
    }
  />

WaveformPaper.propTypes = {
  item: T.shape({
    id: T.string.isRequired,
    title: T.string,
    description: T.string
  }).isRequired,
  answer: T.array,
  showScore: T.bool.isRequired,
  showExpected: T.bool.isRequired,
  showStats: T.bool.isRequired,
  showYours: T.bool.isRequired,
  stats: T.shape({
    total: T.number
  })
}

WaveformPaper.defaultProps = {
  answer: []
}

export {
  WaveformPaper
}
