import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'
import isEmpty from 'lodash/isEmpty'

import {trans} from '#/main/core/translation'
import {number} from '#/main/app/intl'
import {Button} from '#/main/app/action/components/button'
import {CountGauge} from '#/main/core/layout/gauge/components/count-gauge'
import {HtmlText} from '#/main/core/layout/components/html-text'
import {actions as listActions} from '#/main/core/data/list/actions'

import {Forum as ForumType} from '#/plugin/forum/resources/forum/prop-types'
import {select} from '#/plugin/forum/resources/forum/selectors'
import {TagCloud} from '#/plugin/forum/resources/forum/overview/components/tag-cloud'
import {LastMessages} from '#/plugin/forum/resources/forum/overview/components/last-messages'
import {ForumInfo} from '#/plugin/forum/resources/forum/overview/components/forum-info'

const OverviewComponent = props =>
  <div>
    <section className="resource-section resource-overview">
      <h2 className="sr-only">{trans('resource_overview')}</h2>
      <div className="row">
        <div className="user-column col-md-4">
          <section className="user-progression">
            <h3 className="h2">{trans('my_participation', {}, 'forum')}</h3>
            <div className="panel panel-default">
              <div className="panel-body">
                <CountGauge
                  value={3}
                  displayValue={(value) => number(value, true)}
                />
                <h4 className="h5">{trans('my_messages', {}, 'forum')}</h4>
              </div>
            </div>
          </section>
          <section className="user-actions">
            <h3 className="sr-only">{trans('resource_overview_actions', {}, 'resource')}</h3>
            <Button
              label={trans('see_subjects', {}, 'forum')}
              type="link"
              target="/subjects"
              className="btn btn-block"
              primary={true}
            />
            {!props.bannedUser &&
              <Button
                label={trans('create_subject', {}, 'forum')}
                type="link"
                target="/subjects/form"
                className="btn btn-block"
              />
            }
          </section>
          {!isEmpty(props.forum.meta.tags)&&
            <section>
              <h3 className="h2">{trans('tags')}</h3>
              <TagCloud
                tags={props.tagsCount}
                minSize={12}
                maxSize={28}
                callback={() => console.log(props)}
              />
            </section>
          }
        </div>

        <div className="resource-column col-md-8">
          <section className="resource-info">
            <h3 className="h2">{trans('resource_overview_info', {}, 'resource')}</h3>
            {props.forum.display.description &&
              <div className="panel panel-default">
                <HtmlText className="panel-body">{props.forum.display.description}</HtmlText>
              </div>
            }
          </section>
          <ForumInfo
            forum={props.forum}
          />
          {0 !== props.lastMessages.length &&
            <LastMessages
              lastMessages={props.lastMessages}
            />
          }
        </div>
      </div>
    </section>
  </div>

OverviewComponent.propTypes = {
  forum: T.shape(ForumType.propTypes),
  lastMessages: T.shape({}),
  bannedUser: T.bool.isRequired
}

OverviewComponent.defaultProps = {
  lastMessages: []
}

const Overview = connect(
  (state) => ({
    subject: select.subject(state),
    forum: select.forum(state),
    lastMessages: select.lastMessages(state).data,
    tagsCount: select.tagsCount(state),
    bannedUser: select.bannedUser(state),
    moderator: select.moderator(state)
  }),
  dispatch =>({
    addFilter(property, value) {
      dispatch(listActions.addFilter(property, value))
    }
  })
)(OverviewComponent)


export {
  Overview
}
