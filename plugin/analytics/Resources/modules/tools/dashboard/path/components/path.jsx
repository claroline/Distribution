import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {asset} from '#/main/app/config/asset'
import {trans, transChoice} from '#/main/app/intl/translation'
import {LINK_BUTTON, MODAL_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'
import {DataCard} from '#/main/app/content/card/components/data'

import {ResourceNode as ResourceNodeTypes} from '#/main/core/resource/prop-types'
import {route as resourceRoute} from '#/main/core/resource/routing'
import {ResourceIcon} from '#/main/core/resource/components/icon'
import {selectors} from '#/plugin/analytics/tools/dashboard/path/store'
import {MODAL_USER_MESSAGE} from '#/main/core/user/modals/message'
import {BarChart} from '#/main/core/layout/chart/bar/components/bar-chart'

class Path extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentTab: 'graph'
    }
  }

  render() {
    return (
      <article className="path-tracking">
        <DataCard
          orientation="row"
          size="sm"
          id={this.props.path.id}
          poster={this.props.path.thumbnail ? asset(this.props.path.thumbnail.url) : null}
          icon={
            <ResourceIcon className="icon" mimeType={this.props.path.meta.mimeType} />
          }
          title={this.props.path.name}
          flags={[
            ['fa fa-fw fa-eye', transChoice('resource_views', this.props.path.meta.views, {count: this.props.path.meta.views}, 'resource'), this.props.path.meta.views],
            this.props.path.social && ['fa fa-fw fa-thumbs-up', transChoice('resource_likes', this.props.path.social.likes, {count: this.props.path.social.likes}, 'resource'), this.props.path.social.likes]
          ].filter(flag => !!flag)}
          contentText={this.props.path.meta.description}
          actions={[
            {
              name: 'open',
              type: LINK_BUTTON,
              icon: 'fa fa-fw fa-external-link',
              label: trans('open', 'actions'),
              target: resourceRoute(this.props.path)
            }
          ]}
        />

        <ul className="nav nav-tabs">
          <li className={classes({
            active: 'graph' === this.state.currentTab
          })}>
            <a
              href=""
              onClick={(e) => {
                this.setState({currentTab: 'graph'})

                e.preventDefault()
                e.stopPropagation()
              }}
            >
              Statistiques
            </a>
          </li>
          <li className={classes({
            active: 'users' === this.state.currentTab
          })}>
            <a
              href=""
              onClick={(e) => {
                this.setState({currentTab: 'users'})

                e.preventDefault()
                e.stopPropagation()
              }}
            >
              Participants
            </a>
          </li>
        </ul>

        <div className="path-tracking-current">
          {'graph' === this.state.currentTab &&
            <BarChart
              height={160}
              data={this.props.steps.reduce((acc, stepData) => {
                acc[stepData.step.id] = {
                  xData: stepData.step.title,
                  yData: stepData.users.length
                }

                return acc
              }, {not_started: {xData: trans('not_started', {}, 'analytics'), yData: this.props.unstartedUsers.length}})}
              yAxisLabel={{
                show: true,
                text: trans('users_count')
              }}
              xAxisLabel={{
                show: true,
                text: trans('steps', {}, 'path')
              }}
              onClick={(data, idx) => {
                if (0 === idx) {
                  this.props.showStepDetails(this.props.unstartedUsers)
                } else if (this.props.steps[idx - 1] && this.props.steps[idx - 1].users) {
                  this.props.showStepDetails(this.props.steps[idx - 1].users)
                }
              }}
            />
          }

          {'users' === this.state.currentTab &&
            <ListData
              name={`${selectors.STORE_NAME}.evaluations`}
              fetch={{
                url: ['claroline_path_evaluations_list', {resourceNode: this.props.path.id}],
                autoload: true
              }}
              actions={(rows) => [
                {
                  type: MODAL_BUTTON,
                  icon: 'fa fa-fw fa-envelope',
                  label: trans('send_message'),
                  scope: ['object', 'collection'],
                  modal: [MODAL_USER_MESSAGE, {
                    to: rows.map((row) => ({
                      id: row.user.id,
                      name: `${row.user.firstName} ${row.user.lastName}`
                    }))
                  }]
                }
              ]}
              definition={[
                {
                  name: 'user',
                  type: 'user',
                  label: trans('user'),
                  displayed: true
                }, {
                  name: 'user.firstName',
                  type: 'string',
                  label: trans('first_name'),
                  displayable: false,
                  displayed: false
                }, {
                  name: 'user.lastName',
                  type: 'string',
                  label: trans('last_name'),
                  displayable: false,
                  displayed: false
                }, {
                  name: 'progression',
                  type: 'number',
                  label: trans('progression'),
                  displayed: true,
                  render: (rowData) => rowData.progression + ' / ' + rowData.progressionMax
                }, {
                  name: 'score',
                  type: 'number',
                  label: trans('score'),
                  displayed: true,
                  render: (rowData) => {
                    if (rowData.scoreMax) {
                      return (rowData.score) + ' / ' + rowData.scoreMax
                    }

                    return '-'
                  }
                }, {
                  name: 'duration',
                  type: 'number',
                  label: trans('duration'),
                  displayed: true
                }, {
                  name: 'date',
                  type: 'date',
                  label: trans('last_activity'),
                  displayed: true,
                  options: {
                    time: true
                  }
                }
              ]}
            />
          }
        </div>
      </article>
    )
  }
}

Path.propTypes = {
  path: T.shape(
    ResourceNodeTypes.propTypes
  ),
  steps: T.arrayOf(T.shape({
    step: T.shape({
      id: T.string,
      title: T.string
    }),
    users: T.arrayOf(T.shape({
      id: T.string,
      username: T.string,
      firstName: T.string,
      lastName: T.string,
      name: T.string
    }))
  })),
  unstartedUsers: T.arrayOf(T.shape({
    id: T.string,
    username: T.string,
    firstName: T.string,
    lastName: T.string,
    name: T.string
  })),
  invalidateEvaluations: T.func.isRequired,
  showStepDetails: T.func.isRequired
}

export {
  Path
}
