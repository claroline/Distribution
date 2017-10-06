import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import {t, trans} from '#/main/core/translation'

import {ActivableSet} from '#/main/core/layout/form/components/fieldset/activable-set.jsx'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {CheckGroup} from '#/main/core/layout/form/components/group/check-group.jsx'
import {DateGroup}  from '#/main/core/layout/form/components/group/date-group.jsx'
import {FormGroup}  from '#/main/core/layout/form/components/group/form-group.jsx'
import {HtmlGroup}  from '#/main/core/layout/form/components/group/html-group.jsx'
import {TextGroup}  from '#/main/core/layout/form/components/group/text-group.jsx'

import {Announcement as AnnouncementTypes} from './../prop-types'
import {select} from './../selectors'
import {actions} from './../actions'

const AnnounceForm = props =>
  <form>
    <div className="panel panel-default">
      <fieldset className="panel-body">
        <h2 className="sr-only">General properties</h2>

        <TextGroup
          controlId="announcement-title"
          label={t('title')}
          value={props.announcement.title || ''}
          onChange={value => props.updateProperty('title', value)}
        />

        <HtmlGroup
          controlId="announcement-content"
          label={t('content')}
          content={props.announcement.content}
          onChange={value => props.updateProperty('content', value)}
          minRows={10}
        />

        <TextGroup
          controlId="announcement-author"
          label={t('author')}
          value={props.announcement.meta.author || ''}
          onChange={value => props.updateProperty('meta.author', value)}
        />

        <CheckGroup
          checkId="announcement-sendMail"
          label={trans('announcement_send_mail', {}, 'announcement')}
          checked={props.announcement.meta.sendMail}
          onChange={value => props.updateProperty('meta.sendMail', !props.announcement.meta.sendMail)}
        />
      </fieldset>
    </div>

    <FormSections>
      <FormSection
        id="announcement-restrictions"
        icon="fa fa-fw fa-key"
        title={t('access_restrictions')}
      >
        <CheckGroup
          checkId="announcement-visible"
          label={trans('announcement_is_not_visible', {}, 'announcement')}
          labelChecked={trans('announcement_is_visible', {}, 'announcement')}
          checked={props.announcement.restrictions.visible}
          onChange={value => props.updateProperty('restrictions.visible', !props.announcement.restrictions.visible)}
        />

        <ActivableSet
          id="access-dates"
          label={t('access_dates')}
          activated={!isEmpty(props.announcement.restrictions.visibleFrom) || !isEmpty(props.announcement.restrictions.visibleUntil)}
          onChange={activated => {
            if (!activated) {
              props.updateProperty('restrictions.visibleFrom', null)
              props.updateProperty('restrictions.visibleUntil', null)
            }
          }}
        >
          <div className="row">
            <DateGroup
              controlId="announcement-visible-from"
              className="col-md-6 col-xs-6 form-last"
              label={trans('announcement_visible_from', {}, 'announcement')}
              value={props.announcement.restrictions.visibleFrom || ''}
              onChange={(date) => props.updateProperty('restrictions.visibleFrom', date)}
            />

            <DateGroup
              controlId="announcement-visible-until"
              className="col-md-6 col-xs-6 form-last"
              label={trans('announcement_visible_until', {}, 'announcement')}
              value={props.announcement.restrictions.visibleUntil || ''}
              onChange={(date) => props.updateProperty('restrictions.visibleUntil', date)}
            />
          </div>
        </ActivableSet>
      </FormSection>
    </FormSections>
  </form>

AnnounceForm.propTypes = {
  announcement: T.shape(
    AnnouncementTypes.propTypes
  ).isRequired,
  updateProperty: T.func.isRequired
}

AnnounceForm.defaultProps = {
  announcement: AnnouncementTypes.defaultProps
}

function mapStateToProps(state) {
  return {
    announcement: select.formData(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateProperty(prop, value) {
      dispatch(
        actions.updateForm(prop, value)
      )
    }
  }
}

const ConnectedAnnounceForm = connect(mapStateToProps, mapDispatchToProps)(AnnounceForm)

export {
  ConnectedAnnounceForm as AnnounceForm
}
