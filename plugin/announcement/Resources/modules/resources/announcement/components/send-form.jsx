import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import get from 'lodash/get'

// todo use dynamic form
import {t, trans} from '#/main/core/translation'
import {Button} from '#/main/app/action/components/button'
import {ActivableSet} from '#/main/core/layout/form/components/fieldset/activable-set.jsx'
import {ConditionalSet} from '#/main/core/layout/form/components/fieldset/conditional-set.jsx'
import {FormSections, FormSection} from '#/main/core/layout/form/components/form-sections.jsx'
import {CheckGroup} from '#/main/core/layout/form/components/group/check-group.jsx'
import {DateGroup}  from '#/main/core/layout/form/components/group/date-group.jsx'
import {HtmlGroup}  from '#/main/core/layout/form/components/group/html-group.jsx'
import {TextGroup}  from '#/main/core/layout/form/components/group/text-group.jsx'
import {RadiosGroup}  from '#/main/core/layout/form/components/group/radios-group.jsx'
import {CheckboxesGroup}  from '#/main/core/layout/form/components/group/checkboxes-group.jsx'

import {Announcement as AnnouncementTypes} from './../prop-types'
import {select} from './../selectors'
import {actions} from './../actions'

const SendForm = props =>
  <div>
    <form>
      <FormSections level={2} defaultOpened="announcement-form">
        <FormSection
          icon="fa fa-fw fa-paper-plane-o"
          title={trans('announcement_sending', {}, 'announcement')}
          id="announcement-form"
        >
          <RadiosGroup
            id="announcement-notify-users"
            label={trans('announcement_notify_users', {}, 'announcement')}
            choices={{
              0: trans('do_not_send', {}, 'announcement'),
              1: trans('send_directly', {}, 'announcement'),
              2: trans('send_at_predefined_date', {}, 'announcement')
            }}
            value={props.announcement.meta.notifyUsers.toString()}
            onChange={value => {
              props.updateProperty('meta.notifyUsers', parseInt(value))

              if (value === 2 && !props.announcement.meta.notificationDate && props.announcement.restrictions.visibleFrom) {
                props.updateProperty('meta.notificationDate', props.announcement.restrictions.visibleFrom)
              }
            }}
          />

          <ConditionalSet condition={0 !== props.announcement.meta.notifyUsers}>
            <CheckboxesGroup
              id="announcement-sending-roles"
              label={trans('roles_to_send_to', {}, 'announcement')}
              choices={props.workspaceRoles.reduce((acc, current) => {
                acc[current.id] = trans(current.translationKey)

                return acc
              }, {})}
              inline={false}
              value={props.announcement.roles}
              onChange={values => props.updateProperty('roles', values)}
              warnOnly={!props.validating}
              error={get(props.errors, 'roles')}
            />

            {props.announcement.meta.notifyUsers === 2 &&
          <DateGroup
            id="announcement-sending-date"
            label={trans('announcement_sending_date', {}, 'announcement')}
            value={props.announcement.meta.notificationDate}
            onChange={(date) => props.updateProperty('meta.notificationDate', date)}
            time={true}
            warnOnly={!props.validating}
            error={get(props.errors, 'meta.notificationDate')}
          />
            }
          </ConditionalSet>
        </FormSection>
      </FormSections>
    </form>
    <Button
      primary={true}
      label={trans('save')}
      type="callback"
      className="btn"
      callback={() => {
        props.save(props.aggregateId, props.announcement)
      }}
    />
  </div>




SendForm.defaultProps = {
  announcement: AnnouncementTypes.defaultProps
}

function mapStateToProps(state) {
  return {
    announcement: select.formData(state),
    aggregateId: select.aggregateId(state),
    errors: select.formErrors(state),
    validating: select.formValidating(state),
    workspaceRoles: select.workspaceRoles(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    updateProperty(prop, value) {
      dispatch(actions.updateForm(prop, value))
    },
    save(aggregateId, announce) {
      dispatch(
        actions.saveAnnounce(aggregateId, announce)
      )
    }
  }
}

const ConnectedSendForm = connect(mapStateToProps, mapDispatchToProps)(SendForm)

export {
  ConnectedSendForm as SendForm
}
