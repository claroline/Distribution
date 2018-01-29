import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import merge from 'lodash/merge'

import {Action as ActionTypes} from '#/main/core/layout/button/prop-types'
import {HtmlText} from '#/main/core/layout/components/html-text.jsx'
import {Action} from '#/main/core/layout/button/components/action.jsx'
import {Alert} from '#/main/core/layout/alert/components/alert.jsx'
import {AlertBlock} from '#/main/core/layout/alert/components/alert-block.jsx'
import {ScoreGauge} from '#/main/core/layout/progression/components/score-gauge.jsx'

const UserProgression = props =>
  <section className="user-progression">
    <h3 className="h2 h-first">Ma progression</h3>

    <div className="panel panel-default">
      <div className="panel-body">
        {props.score && props.score.displayed &&
          <ScoreGauge
            score={props.score.current}
            maxScore={props.score.total}
          />
        }

        <h4 className="user-progression-status h5">{props.statusText}</h4>
      </div>

      {0 !== props.details.length &&
        <ul className="list-group list-group-values">
          {props.details.map((info, index) =>
            <li key={index} className="list-group-item">
              {info[0]}
              <span className="value">{info[1]}</span>
            </li>
          )}
        </ul>
      }
    </div>
  </section>

UserProgression.propTypes = {
  status: T.string,
  statusText: T.string,
  score: T.shape({
    displayed: T.bool,
    current: T.number,
    total: T.number.isRequired
  }),
  details: T.arrayOf(
    T.arrayOf(T.string)
  )
}

UserProgression.defaultProps = {
  status: 'not_attempted',
  statusText: 'not_attempted',
  details: []
}

const ResourceOverview = props =>
  <section className="resource-overview">
    <h2 className="sr-only">Overview</h2>

    <div className="row">
      <div className="user-column col-md-4">
        {props.progression &&
          <UserProgression
            {...props.progression}
          />
        }

        {0 !== props.actions.length &&
          <section className="user-actions">
            <h3 className="sr-only">Actions disponibles</h3>

            {props.actions.map((action, index) => !action.disabled ?
              <Action
                {...action}
                key={index}
                className={classes('btn-block', {
                  'btn-primary': action.primary,
                  'btn-danger': action.dangerous
                })}
              /> :
              action.disabledMessages && action.disabledMessages.map((message, messageIndex) =>
                <Alert key={messageIndex} type="warning" message={message} />
              )
            )}
          </section>
        }
      </div>

      <div className="resource-column col-md-8">
        <AlertBlock
          type="success"
          title="Evaluation success"
          message="Proin placerat sed justo ornare fringilla. Aliquam faucibus et neque eget porttitor. Nam lacinia odio sed faucibus scelerisque. Morbi convallis tempor odio et vulputate. Nam condimentum eleifend porta. Pellentesque varius orci a tellus sodales venenatis. Pellentesque iaculis leo in arcu eleifend, lobortis consectetur est vulputate. Ut viverra tempor cursus. Fusce dolor lorem, pulvinar non ex a, vehicula dapibus risus."
        />

        {props.contentText &&
          <section className="resource-info">
            <h3 className="h2 h-first">Informations</h3>

            <div className="panel panel-default">
              <HtmlText className="panel-body">{props.contentText}</HtmlText>
            </div>
          </section>
        }

        {props.children}
      </div>
    </div>
  </section>

ResourceOverview.propTypes = {
  contentText: T.string,
  progression: T.shape({
    status: T.string,
    statusText: T.string,
    score: T.shape({
      displayed: T.bool,
      current: T.number,
      total: T.number.isRequired
    }),
    details: T.arrayOf(
      T.arrayOf(T.string)
    )
  }),
  actions: T.arrayOf(T.shape(
    merge({}, ActionTypes.propTypes, {
      disabledMessages: T.arrayOf(T.string)
    })
  )),
  children: T.node
}

ResourceOverview.defaultProps = {
  actions: []
}

export {
  ResourceOverview
}
