import React from 'react'
import {PropTypes as T} from 'prop-types'
import get from 'lodash/get'

import {trans, transChoice} from '#/main/app/intl/translation'
import {displayDate} from '#/main/app/intl/date'

import {DataCard} from '#/main/app/content/card/components/data'
import {UserMicro} from '#/main/core/user/components/micro'
import {UserAvatar} from '#/main/core/user/components/avatar'
import {ScoreGauge} from '#/main/core/layout/evaluation/components/score-gauge'

import {Paper as PaperTypes} from '#/plugin/exo/resources/quiz/papers/prop-types'

const PaperCard = props =>
  <DataCard
    {...props}
    className={props.className}
    id={props.data.id}
    icon={props.data.total ?
      <ScoreGauge
        userScore={props.data.score || 0 === props.data.score ? props.data.score : '?'}
        maxScore={props.data.total}
        size="sm"
      /> :
      <UserAvatar picture={get(props.data, 'user.picture')} alt={true} />
    }
    title={props.data.user ? props.data.user.firstName + ' ' + props.data.user.lastName : trans('unknown')}
    subtitle={trans('attempt', {number: props.data.number}, 'quiz')}
    flags={[
      props.data.finished && ['fa fa-fw fa-check', trans('finished', {}, 'quiz')],
      !props.data.finished && ['fa fa-fw fa-sync', trans('in_progress', {}, 'quiz')]
    ].filter(flag => !!flag)}
    footer={
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {props.data.total &&
          <UserMicro {...props.data.user} />
        }

        {props.data.endDate &&
          trans('finished_at', {date: displayDate(props.data.endDate, false, true)})
        }

        {!props.data.endDate &&
          trans('started_at', {date: displayDate(props.data.startDate, false, true)})
        }
      </span>
    }
  />

PaperCard.propTypes = {
  className: T.string,
  data: T.shape(
    PaperTypes.propTypes
  ).isRequired
}

export {
  PaperCard
}
