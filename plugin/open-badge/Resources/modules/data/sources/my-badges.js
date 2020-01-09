import get from 'lodash/get'

import {trans} from '#/main/app/intl/translation'
import {URL_BUTTON} from '#/main/app/buttons'

import {route as desktopRoute} from '#/main/core/tool/routing'
import {route as workspaceRoute} from '#/main/core/workspace/routing'

import {AssertionBadgeCard} from '#/plugin/open-badge/tools/badges/assertion/components/card'

export default {
  name: 'my_badges',
  icon: 'fa fa-fw fa-trophy',
  parameters: {
    primaryAction: (assertion) => ({
      type: URL_BUTTON,
      target: get(assertion, 'badge.workspace') ?
        `#${workspaceRoute(get(assertion, 'badge.workspace'), 'badges')}/badges/${get(assertion, 'badge.id')}/assertion/${assertion.id}` :
        `#${desktopRoute('badges')}/badges/${get(assertion, 'badge.id')}/assertion/${assertion.id}`
    }),
    definition: [
      {
        name: 'badge.name',
        type: 'string',
        label: trans('name'),
        displayed: true,
        primary: true
      }, {
        name: 'issuedOn',
        label: trans('granted_date', {}, 'badge'),
        type: 'date',
        displayed: true,
        primary: true,
        options: {
          time: true
        }
      }, {
        name: 'badge.meta.enabled',
        type: 'boolean',
        label: trans('enabled', {}, 'badge'),
        displayed: true
      }
    ],
    card: AssertionBadgeCard
  }
}
