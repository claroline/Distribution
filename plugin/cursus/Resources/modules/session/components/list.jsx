import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {now} from '#/main/app/intl/date'
import {hasPermission} from '#/main/app/security'
import {LINK_BUTTON, MODAL_BUTTON, URL_BUTTON} from '#/main/app/buttons'
import {ListData} from '#/main/app/content/list/containers/data'

import {route} from '#/plugin/cursus/routing'
import {MODAL_SESSION_FORM} from '#/plugin/cursus/session/modals/parameters'
import {SessionCard} from '#/plugin/cursus/session/components/card'

const SessionList = (props) =>
  <ListData
    name={props.name}
    fetch={{
      url: props.url,
      autoload: true
    }}
    primaryAction={(row) => ({
      type: LINK_BUTTON,
      target: route(row.meta.course, row),
      label: trans('open', {}, 'actions')
    })}
    delete={{
      url: ['apiv2_cursus_session_delete_bulk']
    }}
    definition={[
      {
        name: 'status',
        type: 'choice',
        label: trans('status'),
        displayed: true,
        options: {
          noEmpty: true,
          choices: {
            not_started: trans('session_not_started', {}, 'cursus'),
            in_progress: trans('session_in_progress', {}, 'cursus'),
            closed: trans('session_closed', {}, 'cursus')
          },
        },
        render: (row) => {
          let status
          if (get(row, 'restrictions.dates[0]') > now(false)) {
            status = 'not_started'
          } else if (get(row, 'restrictions.dates[0]') <= now(false) && get(row, 'restrictions.dates[1]') >= now(false)) {
            status = 'in_progress'
          } else if (get(row, 'restrictions.dates[1]') < now(false)) {
            status = 'closed'
          }

          return (
            <span className={classes('label', {
              'label-success': 'not_started' === status,
              'label-info': 'in_progress' === status,
              'label-danger': 'closed' === status
            })}>
              {trans('session_'+status, {}, 'cursus')}
            </span>
          )
        }
      }, {
        name: 'name',
        type: 'string',
        label: trans('name'),
        displayed: true,
        primary: true
      }, {
        name: 'code',
        type: 'string',
        label: trans('code'),
        sortable: false
      }, {
        name: 'location',
        type: 'location',
        label: trans('location'),
        placeholder: trans('online_session', {}, 'cursus'),
        displayed: true
      }, {
        name: 'restrictions.dates[0]',
        alias: 'startDate',
        type: 'date',
        label: trans('start_date'),
        displayed: true
      }, {
        name: 'restrictions.dates[1]',
        alias: 'endDate',
        type: 'date',
        label: trans('end_date'),
        displayed: true
      }, {
        name: 'workspace',
        type: 'workspace',
        label: trans('workspace'),
        sortable: false
      }, {
        name: 'restrictions.users',
        alias: 'maxUsers',
        type: 'number',
        label: trans('max_participants', {}, 'cursus'),
        displayed: true
      }, {
        name: 'meta.default',
        type: 'boolean',
        label: trans('default')
      }, {
        name: 'registration.selfRegistration',
        alias: 'publicRegistration',
        type: 'boolean',
        label: trans('public_registration')
      }, {
        name: 'registration.selfUnregistration',
        alias: 'publicUnregistration',
        type: 'boolean',
        label: trans('public_unregistration')
      }, {
        name: 'registration.validation',
        alias: 'registrationValidation',
        type: 'boolean',
        label: trans('registration_validation', {}, 'cursus')
      }, {
        name: 'registration.userValidation',
        alias: 'userValidation',
        type: 'boolean',
        label: trans('user_validation', {}, 'cursus')
      }, {
        name: 'meta.order',
        alias: 'order',
        type: 'number',
        label: trans('order'),
        displayable: false,
        filterable: false
      }
    ]}
    card={SessionCard}
    actions={(rows) => [
      {
        name: 'edit',
        type: MODAL_BUTTON,
        icon: 'fa fa-fw fa-pencil',
        label: trans('edit', {}, 'actions'),
        modal: [MODAL_SESSION_FORM, {
          session: rows[0],
          onSave: () => props.invalidate()
        }],
        scope: ['object'],
        group: trans('management')
      }, {
        name: 'export-pdf',
        type: URL_BUTTON,
        icon: 'fa fa-fw fa-file-pdf-o',
        label: trans('export-pdf', {}, 'actions'),
        displayed: hasPermission('open', rows[0]),
        group: trans('transfer'),
        target: ['apiv2_cursus_session_download_pdf', {id: rows[0].id}],
        scope: ['object']
      }
    ]}
  />

SessionList.propTypes = {
  name: T.string.isRequired,
  url: T.oneOfType([T.string, T.array]).isRequired,
  invalidate: T.func.isRequired
}

export {
  SessionList
}
